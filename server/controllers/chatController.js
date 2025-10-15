import OpenAI from 'openai';

const hfToken = process.env.HUGGINGFACE_API_TOKEN || '';
const openaiKey = process.env.OPENAI_API_KEY || '';

function buildPrompt(messages = []) {
  const system = "You are a supportive women's health assistant. Provide general wellness information, not medical advice.";
  const convo = messages
    .map((m) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
    .join('\n');
  return `${system}\n\n${convo}\nAssistant:`;
}

async function callHuggingFace(prompt) {
  const model = process.env.HF_MODEL_ID || 'tiiuae/falcon-7b-instruct';
  const url = `https://api-inference.huggingface.co/models/${encodeURIComponent(model)}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${hfToken}`,
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

async function callOpenAI(messages) {
  const client = new OpenAI({ apiKey: openaiKey });
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: "You are a supportive women's health assistant. Provide general wellness information, not medical advice." },
      ...messages,
    ],
    temperature: 0.4,
    max_tokens: 300,
  });
  return response.choices?.[0]?.message?.content || 'Sorry, I could not generate a reply.';
}

export const chat = async (req, res) => {
  const { messages = [] } = req.body; // [{role, content}]
  try {
    if (hfToken) {
      const prompt = buildPrompt(messages);
      const reply = await callHuggingFace(prompt);
      return res.json({ reply });
    }
    if (openaiKey) {
      const reply = await callOpenAI(messages);
      return res.json({ reply });
    }
    return res.status(200).json({ reply: 'AI is not configured. Please set HUGGINGFACE_API_TOKEN or OPENAI_API_KEY.' });
  } catch (e) {
    return res.status(500).json({ message: 'Chat service error', detail: e.message });
  }
};
