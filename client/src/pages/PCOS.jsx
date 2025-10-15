import { useMemo, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
// Removed theoretical intro; replaced with practical action panel below

const fields = [
  { key:'cycleIrregularity', title:'Irregular cycles', desc:'Cycles longer than 35 days, very short cycles, or unpredictable timing.' },
  { key:'acne', title:'Persistent acne', desc:'Adult acne or acne that worsens around ovulation or period.' },
  { key:'hirsutism', title:'Hair growth (hirsutism)', desc:'Excess facial/body hair growth.' },
  { key:'weightGain', title:'Weight gain or difficulty losing', desc:'Especially around abdomen.' },
  { key:'insulinResistance', title:'Insulin resistance', desc:'Sugar crashes, A1C concerns, or clinical notes.' },
  { key:'familyHistory', title:'Family history', desc:'Close relatives diagnosed with PCOS.' },
]

function scoreFromForm(f){
  // Keep weights in sync with server/controller
  return (f.cycleIrregularity?2:0)
    + (f.acne?1:0)
    + (f.hirsutism?2:0)
    + (f.weightGain?1:0)
    + (f.insulinResistance?2:0)
    + (f.familyHistory?1:0)
}

function riskFromScore(score){
  return score>=6 ? 'High' : score>=3 ? 'Moderate' : 'Low'
}

function riskStyle(risk){
  if(risk==='High') return 'bg-rose-100 text-rose-700 border-rose-200'
  if(risk==='Moderate') return 'bg-amber-100 text-amber-700 border-amber-200'
  return 'bg-emerald-100 text-emerald-700 border-emerald-200'
}

export default function PCOS(){
  const { token } = useSelector(s=>s.auth)
  const [form, setForm] = useState({ cycleIrregularity:false, acne:false, hirsutism:false, weightGain:false, insulinResistance:false, familyHistory:false })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const liveScore = useMemo(()=> scoreFromForm(form), [form])
  const liveRisk = useMemo(()=> riskFromScore(liveScore), [liveScore])
  const livePct = Math.min(100, Math.round((liveScore/8)*100)) // 8 = max weighted score

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true); setError('')
    try{
      let data
      if(token){
        const res = await api.post('/pcos/analyze', form, { headers:{ Authorization:`Bearer ${token}` } })
        data = res.data
      }else{
        // fallback local computation
        const score = scoreFromForm(form)
        data = { score, risk: riskFromScore(score), fallback:true }
      }
      setResult(data)
    }catch(err){
      // final fallback to local compute
      const score = scoreFromForm(form)
      setResult({ score, risk:riskFromScore(score), fallback:true })
      setError('Using local estimate (server unreachable).')
    }finally{
      setLoading(false)
    }
  }

  const toggle = (key)=> setForm(prev=> ({...prev, [key]: !prev[key]}))
  const reset = ()=> { setForm({ cycleIrregularity:false, acne:false, hirsutism:false, weightGain:false, insulinResistance:false, familyHistory:false }); setResult(null); setError('') }

  const handleShowTips = ()=> navigate('/tips')

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6">
      {/* header */}
      <div className="bg-gradient-to-r from-primary-50 to-pink-50 dark:from-gray-800/40 dark:to-gray-800/20 rounded-2xl p-6 md:p-8 border border-pink-100 dark:border-gray-700">
        <h1 className="text-3xl md:text-4xl font-extrabold">PCOS Risk Check</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 max-w-2xl">A supportive, informational tool—not medical advice. Review common indicators and get a gentle risk snapshot you can discuss with a clinician.</p>
      </div>

      {/* Practical quick-actions (replaces long theoretical intro) */}
      <section className="mt-6 grid gap-4">
        <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-5">
          <h2 className="text-xl font-semibold">What to do next — quick, practical steps</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">This short checklist helps you turn awareness into actions you can try today. Results are supportive, not diagnostic.</p>

          <div className="mt-4 grid sm:grid-cols-2 gap-3">
            <div className="rounded-lg p-3 border bg-green-50 dark:bg-green-900/20">
              <h4 className="font-semibold">Track consistently</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Log periods, symptoms, mood and weight for 2–3 cycles — patterns help clinicians and the app give better insights.</p>
            </div>
            <div className="rounded-lg p-3 border bg-blue-50 dark:bg-blue-900/20">
              <h4 className="font-semibold">Small diet changes</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Focus on whole foods, reduce refined carbs and try smaller, frequent meals to stabilise energy.</p>
            </div>
            <div className="rounded-lg p-3 border bg-yellow-50 dark:bg-yellow-900/10">
              <h4 className="font-semibold">Move a little daily</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Aim for 20–30 minutes of moderate activity most days — brisk walking, yoga, or strength-focused sessions help.</p>
            </div>
            <div className="rounded-lg p-3 border bg-pink-50 dark:bg-pink-900/10">
              <h4 className="font-semibold">Sleep & stress</h4>
              <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">Prioritise 7–8 hours and use small stress tools (breathing, 10‑minute walks) when overwhelmed.</p>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <button onClick={()=>navigate('/tracker')} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded">Open Tracker</button>
            <button onClick={handleShowTips} className="px-4 py-2 rounded border">Practical tips</button>
            <button onClick={()=>navigate('/consult')} className="px-4 py-2 rounded bg-pink-600 text-white">Consult a clinician</button>
          </div>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <h3 className="font-semibold">Tailored recommendations</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Based on the quick snapshot below, here are concise, practical suggestions.</p>
          <div className="mt-3">
            {(()=>{
              const recs = getPracticalRecommendations(liveRisk)
              return recs.map((r,i)=> (
                <div key={i} className="mt-2 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center font-semibold">{i+1}</div>
                  <div className="text-sm text-gray-700 dark:text-gray-300">{r}</div>
                </div>
              ))
            })()}
          </div>
        </div>
      </section>

      {/* content */}
      <div className="mt-6 grid lg:grid-cols-[2fr_1fr] gap-6">
        {/* form */}
        <form onSubmit={submit} className="space-y-4">
          <div>
            <h2 className="text-xl font-bold">What are your symptoms saying?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Toggle the cards that resonate—change anytime, this is just a gentle snapshot.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {fields.map(f=> (
              <button type="button" key={f.key} onClick={()=>toggle(f.key)}
                className={`text-left rounded-xl border shadow-sm p-4 hover:shadow transition ${form[f.key]?'border-primary-300 ring-2 ring-primary-200 bg-primary-50':'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{f.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{f.desc}</p>
                  </div>
                  <span className={`mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${form[f.key]?'bg-primary-500 text-white':'bg-gray-200 text-gray-700'}`}>{form[f.key]?'Yes':'No'}</span>
                </div>
              </button>
            ))}
          </div>

          {error && <div className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">{error}</div>}

          <div className="flex flex-wrap gap-3">
            <button disabled={loading} className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded shadow disabled:opacity-60">{loading? 'Checking…' : 'Check Risk'}</button>
            <button type="button" onClick={reset} className="px-4 py-2 rounded border">Reset</button>
          </div>
        </form>

        {/* live preview */}
        <aside className="rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4 h-fit sticky top-4">
          <h4 className="font-semibold">Live preview</h4>
          <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border ${riskStyle(liveRisk)}`}>
            <span className="w-2 h-2 rounded-full bg-current"></span>
            <span>{liveRisk} risk</span>
          </div>
          <div className="mt-4">
            <div className="text-sm text-gray-600 dark:text-gray-300">Estimated score: {liveScore} / 8</div>
            <div className="mt-2 h-2 rounded bg-gray-200 dark:bg-gray-700 overflow-hidden">
              <div className={`h-full ${liveRisk==='High'?'bg-rose-500': liveRisk==='Moderate'?'bg-amber-500':'bg-emerald-500'}`} style={{width: livePct+'%'}} />
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-500">This preview updates as you toggle options. Press “Check Risk” to save the result from the server when signed in.</p>
          {result && (
            <div className="mt-4 border-t pt-4">
              <div className="text-sm">Result</div>
              <div className={`mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full border ${riskStyle(result.risk)}`}>
                <span className="w-2 h-2 rounded-full bg-current"></span>
                <span>{result.risk} risk</span>
              </div>
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-300">Score: {result.score} {result.fallback && <span className="ml-2 text-xs text-amber-600">(local estimate)</span>}</div>
            </div>
          )}
        </aside>
      </div>

      {/* prompt to reveal tips */}
  <section className="mt-8 rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-5 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold">Manage lifestyle with supportive tips?</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">We can show gentle, practical tips and curated reads tailored for PCOS.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleShowTips} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded shadow">Yes, show tips</button>
            <button onClick={()=>{}} className="px-4 py-2 rounded border hover:bg-gray-50">Not now</button>
          </div>
        </div>
      </section>

      {/* tips content moved to /tips page */}
    </div>
  )
}

// Practical short recommendations shown on the page.
function getPracticalRecommendations(risk){
  if(risk === 'High'){
    return [
      'Book a clinical consult: bring 2–3 cycle logs and recent weight/BP records.',
      'Ask about blood tests: fasting glucose, lipid panel, and total/free testosterone.',
      'Consider a structured plan: short-term diet support + activity + specialist referral.'
    ]
  }
  if(risk === 'Moderate'){
    return [
      'Track for 2–3 cycles: include periods, symptoms and a few fasting mornings for trends.',
      'Try modest carb reduction and add protein at meals to improve energy swings.',
      'Increase consistency of movement: 20–30 minutes, 4–5 days per week.'
    ]
  }
  // Low
  return [
    'Keep tracking and note any changes — early patterns make later conversations easier.',
    'Focus on sleep hygiene and small, maintainable diet tweaks.',
    'Use stress-reducing micro-habits: 5–10 minute breathing, short walks, or stretching.'
  ]
}

function TipCard({ title, children }){
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
      <h5 className="font-semibold">{title}</h5>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{children}</p>
    </div>
  )
}
