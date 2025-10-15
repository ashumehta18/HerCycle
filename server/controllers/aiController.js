import fetch from 'node-fetch'

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

async function callOpenAI(baseUrl, apiKey, model, prompt){
  const url = `${baseUrl}/chat/completions`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages:[{ role:'user', content: prompt }], temperature: 0.7 })
  })
  if(!res.ok){ throw new Error(`OpenAI error ${res.status}`) }
  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() || 'No content'
}

async function callAzure(baseUrl, apiKey, _model, prompt){
  // Azure path already includes deployment; api-version required
  const url = `${baseUrl}/chat/completions?api-version=${process.env.AZURE_OPENAI_API_VERSION || '2024-02-15-preview'}`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'api-key': apiKey },
    body: JSON.stringify({ messages:[{ role:'user', content: prompt }], temperature: 0.7 })
  })
  if(!res.ok){ throw new Error(`Azure OpenAI error ${res.status}`) }
  const json = await res.json()
  return json.choices?.[0]?.message?.content?.trim() || 'No content'
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
    const { provider, apiKey, model, baseUrl } = llmConfig()
    if(!apiKey) return res.status(400).json({ error:'LLM API key missing. Set OPENAI_API_KEY or OPENROUTER_API_KEY or AZURE_OPENAI_API_KEY.' })
    const { overview, sections, recommendations } = req.body || {}
    if(!Array.isArray(overview) || !Array.isArray(sections)){
      return res.status(400).json({ error:'Invalid payload. Expect overview[], sections[].' })
    }
    const prompt = promptFromPayload({ overview, sections, recommendations: recommendations||[] })
    let content = ''
    if(provider==='openai') content = await callOpenAI(baseUrl, apiKey, model, prompt)
    else if(provider==='azure') content = await callAzure(baseUrl, apiKey, model, prompt)
    else content = await callOpenRouter(baseUrl, apiKey, model, prompt)
    res.json({ narrative: content })
  }catch(err){ next(err) }
}
