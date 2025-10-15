import { useEffect, useMemo, useState } from 'react'
import { loadUserData, generateAiReport, formatReportText } from '../utils/aiReport'
import api from '../utils/api'

export default function Report(){
  const [data, setData] = useState(null)
  useEffect(()=>{ setData(loadUserData()) },[])
  const report = useMemo(()=> data ? generateAiReport(data) : null, [data])
  if(!report) return <div className="max-w-4xl mx-auto p-6">Generating report…</div>
  const copy = async ()=>{ try{ await navigator.clipboard.writeText(formatReportText(report)) } catch(e){} }
  const printIt = ()=> window.print()
  const [narrative, setNarrative] = useState('')
  const [busy, setBusy] = useState(false)
  const generateNarrative = async ()=>{
    try{
      setBusy(true)
  const payload = { overview: report.overview, sections: report.sections, recommendations: report.recommendations }
  const { data:resp } = await api.post('/ai/report', payload)
      setNarrative(resp?.narrative || '')
    }catch(e){ setNarrative('Unable to generate narrative. Check server/.env configuration.') }
    finally{ setBusy(false) }
  }
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">{report.title}</h1>
        <div className="flex gap-2">
          <button onClick={copy} className="px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          <button onClick={printIt} className="px-3 py-1.5 rounded bg-pink-600 hover:bg-pink-700 text-white">Print</button>
          <button onClick={generateNarrative} disabled={busy} className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white disabled:opacity-60">{busy? 'Generating…':'Generate AI Narrative'}</button>
        </div>
      </div>
      <div className="rounded-xl border p-4 sm:p-6 bg-white/80 dark:bg-gray-900/70">
        <div className="text-gray-700 dark:text-gray-300 space-y-6">
          <section>
            <h2 className="text-xl font-medium mb-2">Overview</h2>
            <ul className="list-disc ml-6">
              {report.overview.map((o,i)=>(<li key={i}>{o}</li>))}
            </ul>
          </section>
          {report.sections.map((sec, idx)=> (
            <section key={idx}>
              <h3 className="text-lg font-medium mb-2">{sec.heading}</h3>
              <ul className="list-disc ml-6">
                {sec.items.map((it,i)=>(<li key={i}>{it}</li>))}
              </ul>
            </section>
          ))}
          {report.recommendations.length>0 && (
            <section>
              <h3 className="text-lg font-medium mb-2">Recommendations</h3>
              <ul className="list-disc ml-6">
                {report.recommendations.map((r,i)=>(<li key={i}>{r}</li>))}
              </ul>
            </section>
          )}
          {narrative && (
            <section>
              <h3 className="text-lg font-medium mb-2">AI Narrative</h3>
              <div className="prose prose-p:my-2 max-w-none text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{narrative}</div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
