import { useState } from 'react'
import { formatReportText } from '../utils/aiReport'

export default function Consult(){
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const sampleReport = `Wellness summary - bring this when consulting with a clinician.`

  const sendAppLink = ()=>{
    if(!phone || phone.replace(/\D/g,'').length<6) return alert('Enter a valid phone number')
    // Client-only: copy a sample link to clipboard and show a confirmation
    try{ navigator.clipboard.writeText(`Open HerCycle app: https://hercycle.example/app-link for ${phone}`) }catch(e){}
    setSent(true)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="bg-gradient-to-br from-purple-600 to-pink-500 text-white rounded-xl p-6 shadow-lg">
          <h1 className="text-3xl font-extrabold">Ask Doctor, in Just One Click!</h1>
          <p className="mt-3 text-teal-100">Consult online via video, audio or text.</p>

          <ul className="mt-6 space-y-3 text-sm">
            <li className="flex items-start gap-3"><span className="inline-block w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📅</span> Book online appointments</li>
            <li className="flex items-start gap-3"><span className="inline-block w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">⏱️</span> Get real-time updates</li>
            <li className="flex items-start gap-3"><span className="inline-block w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">📄</span> Get digital prescriptions</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-xl p-6 border shadow">
          <h2 className="text-xl font-semibold">Book Consultation</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Enter your mobile number and we'll prepare a quick link to open the app or share the report with your device.</p>

          <div className="mt-4 flex gap-2">
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border rounded-full px-3 py-2 flex-1">
              <span className="text-sm text-gray-500">+91</span>
              <input value={phone} onChange={(e)=>{ setPhone(e.target.value); setSent(false) }} placeholder="Enter mobile number" className="bg-transparent outline-none w-full" />
            </div>
            <button onClick={sendAppLink} className="px-4 py-2 rounded-full bg-teal-600 text-white">Send App Link</button>
          </div>
          {sent && <div className="mt-3 text-sm text-green-600">Link prepared — paste it into SMS/WhatsApp to send to your phone.</div>}

          <div className="mt-6">
            <a target="_blank" rel="noreferrer" href="https://www.google.com/search?q=gynecologist+near+me" className="inline-block px-4 py-2 rounded bg-gray-100 dark:bg-gray-800">Find local doctors</a>
          </div>
        </div>
      </div>
    </div>
  )
}
