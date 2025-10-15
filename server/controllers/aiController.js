import fetch from 'node-fetch'
import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

function llmConfig(){
  const provider = process.env.LLM_PROVIDER || 'openai' // 'openai' | 'azure' | 'openrouter'
  const apiKey = process.env.OPENAI_API_KEY || process.env.AZURE_OPENAI_API_KEY || process.env.OPENROUTER_API_KEY
  const model = process.env.LLM_MODEL || (provider==='openai' ? 'gpt-4o-mini' : provider==='azure' ? process.env.AZURE_OPENAI_DEPLOYMENT : 'openrouter/auto')
  const baseUrl = provider==='openai' ? (process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1')
    : provider==='azure' ? `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${encodeURIComponent(model)}`
    : 'https://api.openrouter.ai/v1'
  return { provider, apiKey, model, baseUrl }
}

function promptFromPayload(body){
  const { overview = [], sections = [], recommendations = [] } = body
  const outline = [
    '# HerCycle Wellness Report (Draft)',
    'Use a friendly, supportive tone. Summarize clearly in short paragraphs, then bullets.',
    '',
    'Overview:', ...overview.map(o=>`- ${o}`), '',
    ...sections.flatMap(sec=> [`${sec.heading}:`, ...sec.items.map(i=>`- ${i}`), '']),
    recommendations.length ? 'Recommendations:' : '',
    ...recommendations.map(r=>`- ${r}`)
  ].join('\n')
  return `You are a compassionate women's health assistant. Turn the following data into a short, readable report (2-4 paragraphs max) followed by 4-6 concise bullets. Avoid medical diagnosis; suggest consulting a clinician for concerns.\n\n${outline}`
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

// Hugging Face
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
  const reply = Array.isArray(data) && data[0]?.generated_text ? data[0].generated_text : null;
  return reply || 'Sorry, I could not generate a reply.';
}

// Gemini
async function callGemini(messages, apiKey){
  const genAI = new GoogleGenerativeAI(apiKey)
  const modelCandidates = [
    (process.env.GEMINI_MODEL || '').trim() || 'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-pro',
    'gemini-pro-latest',
    'gemini-1.0-pro'
  ]
  const system = "You are a supportive women's health assistant. Provide general wellness information, not medical advice."
  const convo = messages.map(m=> `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n')
  const prompt = `${system}\n\n${convo}\nAssistant:`

  let lastErr
  for(const modelId of modelCandidates){
    try{
      const model = genAI.getGenerativeModel({ model: modelId })
      try{
        const result = await model.generateContent([{ role: 'user', parts:[{ text: prompt }]}])
        const text = result?.response?.text?.() || result?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        if(text) return text
      }catch(inner){
        const result2 = await model.generateContent(prompt)
        const text2 = result2?.response?.text?.() || result2?.response?.candidates?.[0]?.content?.parts?.[0]?.text
        if(text2) return text2
        throw inner
      }
    }catch(e){
      lastErr = e
      const status = e?.status || e?.response?.status
      if(status && status !== 404) break
    }
  }
  if(lastErr) throw lastErr
  return 'Sorry, I could not generate a reply.'
}

async function callOpenRouter(baseUrl, apiKey, model, prompt){
  const url = `${baseUrl}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages:[{ role:'user', content: prompt }], provider:{ order:['openai','anthropic','google'] } })
  })
  if(!res.ok){ throw new Error(`OpenRouter error ${res.status}`) }
  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() || 'No content'
}

export async function generateAiReportNarrative(req, res, next){
  try{
    // Provider selection logic (same as chatController)
    const hfToken = (process.env.HUGGINGFACE_API_TOKEN || '').trim();
    const openaiKey = (process.env.OPENAI_API_KEY || '').trim();
    const geminiKey = (process.env.GOOGLE_GEMINI_API_KEY || process.env.GEMINI_API_KEY || '').trim();
    const providerPref = (process.env.CHAT_PROVIDER || 'auto').trim().toLowerCase();
    const { overview, sections, recommendations } = req.body || {}
    if(!Array.isArray(overview) || !Array.isArray(sections)){
      return res.status(400).json({ error:'Invalid payload. Expect overview[], sections[].' })
    }
    // Convert report payload to OpenAI-style messages
    const prompt = promptFromPayload({ overview, sections, recommendations: recommendations||[] })
    const messages = [{ role:'user', content: prompt }]

    // Utility to try OpenAI path with fallbacks
    const tryOpenAI = async ()=>{
      const primaryModel = process.env.CHAT_MODEL || process.env.LLM_MODEL || 'gpt-4o-mini'
      try{
        const reply = await callOpenAI(messages, openaiKey, primaryModel);
        return reply
      }catch(e){
        const status = e?.status || e?.response?.status
        if(status===400 || status===404){
          try{
            const fallbackModel = 'gpt-3.5-turbo'
            const reply = await callOpenAI(messages, openaiKey, fallbackModel)
            return reply
          }catch(e2){ throw e2 }
        }
        if(status===429 && geminiKey){
          return await callGemini(messages, geminiKey)
        }
        if(status===429 && hfToken){
          return await callHuggingFace(prompt, hfToken)
        }
        throw e
      }
    }

    // Respect provider preference
    if(providerPref==='openai'){
      if(!openaiKey) return res.status(400).json({ error:'Chat service error', detail:'CHAT_PROVIDER=openai but OPENAI_API_KEY is not set.' })
      const reply = await tryOpenAI()
      return res.json({ narrative: reply })
    }
    if(providerPref==='gemini'){
      if(!geminiKey) return res.status(400).json({ error:'Chat service error', detail:'CHAT_PROVIDER=gemini but GOOGLE_GEMINI_API_KEY is not set.' })
      const reply = await callGemini(messages, geminiKey)
      return res.json({ narrative: reply })
    }
    if(providerPref==='huggingface'){
      if(!hfToken) return res.status(400).json({ error:'Chat service error', detail:'CHAT_PROVIDER=huggingface but HUGGINGFACE_API_TOKEN is not set.' })
      const reply = await callHuggingFace(prompt, hfToken)
      return res.json({ narrative: reply })
    }

    // 'auto' mode (default): Prefer OpenAI, then Gemini, then HF
    if (openaiKey) {
      const reply = await tryOpenAI()
      return res.json({ narrative: reply })
    }
    if(geminiKey){
      const reply = await callGemini(messages, geminiKey)
      return res.json({ narrative: reply })
    }
    if (hfToken) {
      const reply = await callHuggingFace(prompt, hfToken)
      return res.json({ narrative: reply })
    }
    return res.status(200).json({ narrative: 'AI is not configured. Please set HUGGINGFACE_API_TOKEN or OPENAI_API_KEY or GOOGLE_GEMINI_API_KEY.' });
  }catch(err){
    next(err)
  }
}
