import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai'

function buildPrompt(messages = []) {
  const system = "You are a supportive women's health assistant. Provide general wellness information, not medical advice.";
  const convo = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  return `${system}\n\n${convo}\nAssistant:`;
}

async function callHuggingFace(prompt, token) {
  const model = process.env.HF_MODEL_ID || 'tiiuae/falcon-7b-instruct';
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: {
        max_new_tokens: 300,
        temperature: 0.4,
        return_full_text: false,
      },
    }),
  });
  if (!r.ok) {
    const text = await r.text();
    throw new Error(`HF API error ${r.status}: ${text}`);
  }
  const data = await r.json();
  // HF responses often like: [{ generated_text: '...' }]
  const reply = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : null;
  return reply || 'Sorry, I could not generate a reply.';
}

async function callOpenAI(messages, apiKey, model) {
  const client = new OpenAI({ apiKey });
  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: "You are a supportive women's health assistant. Provide general wellness information, not medical advice." },
      ...messages,
    ],
    temperature: 0.4,
    max_tokens: 300,
  });
  return response.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';
}

async function callGemini(messages, apiKey){
  const genAI = new GoogleGenerativeAI(apiKey)
  const modelCandidates = [
    (process.env.GEMINI_MODEL || '').trim() || 'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    // older, widely available text models for v1beta
    'gemini-pro',
    'gemini-pro-latest',
    'gemini-1.0-pro'
  ]
  // Convert OpenAI-style messages to a single prompt
  const system = "You are a supportive women's health assistant. Provide general wellness information, not medical advice."
  const convo = messages.map(m=> `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
  const prompt = `${system}\n\n${convo}\nAssistant:`

  let lastErr
  for(const modelId of modelCandidates){
    try{
      const model = genAI.getGenerativeModel({ model: modelId })
      // Try structured call first
      try{
        const result = await model.generateContent([{ role: 'user', parts:[{ text: prompt }]}])
        const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        if(text) return text
      }catch(inner){
        // Fallback to simple string prompt for older SDK/model combos
        const result2 = await model.generateContent(prompt)
        const text2 = result2?.response?.text?.() || result2?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        if(text2) return text2
        throw inner
      }
    }catch(e){
      lastErr = e
      const status = e?.status || e?.response?.status
      if(status && status !== 404) break // only iterate on 404 (model not found)
    }
  }
  if(lastErr) throw lastErr
  return 'Sorry, I could not generate a reply.'
}

export const chat = async (req, res) => {
  const { messages = [] } = req.body; // [{role, content}]
  try {
    // Read env at request-time to avoid ESM import order issues with dotenv
    const hfToken = (process.env.HUGGINGFACE_API_TOKEN || '').trim();
    const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
    const geminiKey = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
    const providerPref = (process.env.CHAT_PROVIDER || 'auto').trim().toLowerCase(); // 'auto' | 'openai' | 'gemini' | 'huggingface'

    // Utility to try OpenAI path with fallbacks
    const tryOpenAI = async ()=>{
      const primaryModel = process.env.CHAT_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini'
      try{
        const reply = await callOpenAI(messages, openaiKey, primaryModel);
        return res.json({ reply });
      }catch(e){
        const status = e?.status || e?.response?.status
        // If model not available or invalid, try a safer fallback
        if(status===400 || status===404){
          try{
            const fallbackModel = 'gpt-3.5-turbo'
            const reply = await callOpenAI(messages, openaiKey, fallbackModel)
            return res.json({ reply, model: fallbackModel })
          }catch(e2){
            throw e2
          }
        }
        // If rate-limited or quota exceeded, fall back to Gemini, then HF
        if(status===429 && geminiKey){
          const reply = await callGemini(messages, geminiKey)
          return res.json({ reply, provider: 'gemini' })
        }
        const hfToken = (process.env.HUGGINGFACE_API_TOKEN || '').trim();
        if(status===429 && hfToken){
          const prompt = buildPrompt(messages)
          const reply = await callHuggingFace(prompt, hfToken)
          return res.json({ reply, provider: 'huggingface' })
        }
        throw e
      }
    }

    // Respect provider preference
    if(providerPref==='openai'){
      if(!openaiKey) return res.status(400).json({ message:'Chat service error', detail:'CHAT_PROVIDER=openai but OPENAI_API_KEY is not set.' })
      return await tryOpenAI()
    }
    if(providerPref==='gemini'){
      if(!geminiKey) return res.status(400).json({ message:'Chat service error', detail:'CHAT_PROVIDER=gemini but GOOGLE_GEMINI_API_KEY is not set.' })
      const reply = await callGemini(messages, geminiKey)
      return res.json({ reply, provider:'gemini' })
    }
    if(providerPref==='huggingface'){
      if(!hfToken) return res.status(400).json({ message:'Chat service error', detail:'CHAT_PROVIDER=huggingface but HUGGINGFACE_API_TOKEN is not set.' })
      const prompt = buildPrompt(messages);
      const reply = await callHuggingFace(prompt, hfToken);
      return res.json({ reply, provider:'huggingface' });
    }

    // 'auto' mode (default): Prefer OpenAI, then Gemini, then HF
    if (openaiKey) {
      return await tryOpenAI()
    }
    // If OpenAI not configured, try Gemini
    if(geminiKey){
      const reply = await callGemini(messages, geminiKey)
      return res.json({ reply, provider:'gemini' })
    }
    if (hfToken) {
      const prompt = buildPrompt(messages);
      const reply = await callHuggingFace(prompt, hfToken);
      return res.json({ reply });
    }
    return res.status(200).json({ reply: 'AI is not configured. Please set HUGGINGFACE_API_TOKEN or OPENAI_API_KEY.' });
  } catch (e) {
    const status = e?.status || e?.response?.status || 500
    const detail = e?.error?.message || e?.message || 'Unknown error'
    console.error('[chat] error:', { status, detail })
    return res.status(status).json({ message: 'Chat service error', detail })
  }
};

export const chatStatus = async (req, res) => {
  try{
    const hfToken = (process.env.HUGGINGFACE_API_TOKEN || '').trim();
    const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
    const model = process.env.CHAT_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini';
    const geminiKey = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
    const providerPref = (process.env.CHAT_PROVIDER || 'auto').trim().toLowerCase();
    const provider = openaiKey ? 'openai' : (geminiKey ? 'gemini' : (hfToken ? 'huggingface' : 'none'));
    return res.json({ provider, providerPreference: providerPref, model, configured: provider!=='none',
      openaiConfigured: !!openaiKey, geminiConfigured: !!geminiKey, huggingfaceConfigured: !!hfToken });
  }catch(e){
    return res.status(500).json({ error:'status-error', detail: e.message });
  }
}
