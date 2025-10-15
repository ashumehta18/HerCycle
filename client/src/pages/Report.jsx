import { useEffect, useMemo, useState } from 'react'
import { loadUserData, generateAiReport, formatReportText } from '../utils/aiReport'
import api from '../utils/api'

export default function Report(){
  const [data, setData] = useState(null)
  useEffect(()=>{ setData(loadUserData()) },[])
  const report = useMemo(()=> data ? generateAiReport(data) : null, [data])
  const token = localStorage.getItem('token')
  const lsKeys = Object.keys(localStorage).slice(0,50)
  const [errorBanner, setErrorBanner] = useState('')
  if(!report) return <div className="max-w-4xl mx-auto p-6">Generating report…</div>
  const copy = async ()=>{ try{ await navigator.clipboard.writeText(formatReportText(report)) } catch(e){} }
  const printIt = ()=> window.print()
  const [narrative, setNarrative] = useState('')
  const [busy, setBusy] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [phone, setPhone] = useState('')
  const [linkSent, setLinkSent] = useState(false)
  const generateNarrative = async ()=>{
    try{
      setBusy(true)
  const payload = { overview: report.overview, sections: report.sections, recommendations: report.recommendations }
  const { data:resp } = await api.post('/ai/report', payload)
      setNarrative(resp?.narrative || '')
    }catch(e){ setNarrative('Unable to generate narrative. Check server/.env configuration.') }
    finally{ setBusy(false) }
  }
  const openConsultModal = ()=> setShowModal(true)
  const closeConsultModal = ()=> setShowModal(false)
  const consultEmail = ()=>{
    const subject = encodeURIComponent(`HerCycle - Wellness Report${data?.user?.name ? ` for ${data.user.name}` : ''}`)
    const body = encodeURIComponent(formatReportText(report))
    return `mailto:?subject=${subject}&body=${body}`
  }
  // Expose error banner setter to UI for easier debugging
  const showError = (msg)=> setErrorBanner(msg)
  return (
    <>
    <div className="max-w-4xl mx-auto p-6">
      {errorBanner && <div className="mb-4 p-3 rounded bg-red-100 text-red-800">{errorBanner}</div>}
      <div className="mb-4 text-sm text-gray-600">Debug: token={token ? 'present' : 'missing'} · localStorage keys: {lsKeys.join(', ')}</div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl sm:text-3xl font-semibold">{report.title}</h1>
        <div className="flex gap-2">
          <button onClick={copy} className="px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-800">Copy</button>
          <button onClick={printIt} className="px-3 py-1.5 rounded bg-pink-600 hover:bg-pink-700 text-white">Print</button>
          <button onClick={generateNarrative} disabled={busy} className="px-3 py-1.5 rounded bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white disabled:opacity-60">{busy? 'Generating…':'Generate AI Narrative'}</button>
          <button onClick={openConsultModal} className="px-3 py-1.5 rounded border hover:bg-gray-50 dark:hover:bg-gray-800">Consult a doctor</button>
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
    {showModal && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-xl w-full">
          <h3 className="text-lg font-semibold mb-2">Consult a doctor</h3>
          <p className="mb-4 text-sm text-gray-600">You can share this report with a clinician. The button below will open your email client with the report pre-filled. If you prefer, copy the report and paste into a secure portal.</p>
          <div className="flex gap-2 justify-end">
            <a href={consultEmail()} className="px-3 py-1.5 rounded bg-pink-600 text-white">Open email client</a>
            <button onClick={async ()=>{ try{ await navigator.clipboard.writeText(formatReportText(report)); showError('Report copied to clipboard') }catch(e){ showError('Copy failed') } }} className="px-3 py-1.5 rounded border">Copy report</button>
            <button onClick={closeConsultModal} className="px-3 py-1.5 rounded">Close</button>
          </div>
        </div>
      </div>
    )}
    {/* Consult panel inspired by provided design (adapted to HerCycle theme) */}
    <div className="max-w-6xl mx-auto p-6 mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center bg-gradient-to-r from-white to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-xl p-6 shadow">
        <div className="order-2 md:order-1 flex justify-center">
          {/* Illustration placeholder - use app colors and simple phone mock */}
          <div className="w-64 h-40 bg-gradient-to-br from-purple-50 to-pink-100 rounded-xl flex items-center justify-center border">
            <div className="text-center">
              <div className="text-sm text-pink-600 font-semibold">HerCycle</div>
              <div className="mt-2 text-xs text-gray-600">Book appointments • Consult online • Get records</div>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-gray-100">Ask a doctor, in just one click</h2>
          <p className="mt-2 text-teal-500">Consult online via video, audio or text.</p>
          <p className="mt-3 text-gray-600 dark:text-gray-300">Bring your report to a clinician quickly. Enter a phone number and we'll prepare a link you can send to your device, or open a list of nearby clinicians to book an appointment.</p>

          <div className="mt-4 flex flex-col sm:flex-row gap-3 items-center">
            <div className="flex items-center gap-2 bg-white dark:bg-gray-900 border rounded-full px-3 py-2 w-full sm:w-auto">
              <span className="text-sm text-gray-500">+91</span>
              <input aria-label="phone" value={phone} onChange={(e)=>{ setPhone(e.target.value); setLinkSent(false) }} className="bg-transparent outline-none ml-2 text-sm" placeholder="Enter mobile number" />
            </div>
            <button onClick={()=>{ if(!phone || phone.replace(/\D/g,'').length<6){ showError('Enter a valid phone number'); return } setLinkSent(true); try{ navigator.clipboard.writeText(`HerCycle link sent to ${phone}`) }catch(e){} showError('App link prepared - paste it into your messages') }} className="px-4 py-2 rounded-full bg-teal-600 text-white hover:bg-teal-700">Send App Link</button>
            <a target="_blank" rel="noreferrer" href="https://www.google.com/search?q=gynecologist+near+me" className="px-4 py-2 rounded-full border text-slate-900 dark:text-gray-100">Find local doctors</a>
          </div>

          {linkSent && <div className="mt-3 text-sm text-green-600">Link prepared — paste it into your SMS/WhatsApp to share with your device.</div>}
        </div>
      </div>
    </div>
    </>
  )
}
