import { useState } from 'react'
import api from '../utils/api'
import { formatReportText } from '../utils/aiReport'

export default function Consult(){
  const [phone, setPhone] = useState('')
  const [sent, setSent] = useState(false)
  const sampleReport = `Wellness summary - bring this when consulting with a clinician.`

    const [loading, setLoading] = useState(false)

    const sendAppLink = async ()=>{
      if(!phone || phone.replace(/\D/g,'').length<6) return alert('Enter a valid phone number')
      try{
        setLoading(true)
        await api.post('/consult/send', { phone })
        setSent(true)
      }catch(err){
        console.error(err)
        alert(err?.response?.data?.error || 'Failed to send link. Check server logs and Twilio config.')
      }finally{ setLoading(false) }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="rounded-2xl overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2 bg-gradient-to-br from-purple-600 via-fuchsia-600 to-pink-500 text-white p-8 flex flex-col justify-between">
          <div className="flex items-start gap-6">
            <div>
              <h1 className="text-4xl font-extrabold leading-tight">Ask a doctor, in just one click</h1>
              <p className="mt-3 text-teal-100 max-w-prose">Consult online via video, audio or text. Share your HerCycle report instantly with a clinician or receive an app link on your phone.</p>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Feature icon="📅" title="Appointments" desc="Book slots quickly" />
                <Feature icon="🩺" title="Verified Doctors" desc="Trusted clinicians" />
                <Feature icon="📄" title="Digital Records" desc="Share reports securely" />
              </div>
            </div>

            <div className="hidden md:flex items-center justify-center">
              <div className="w-48 h-64 bg-white/10 rounded-xl flex items-center justify-center p-4">
                {/* More human-like standing doctor SVG (stylized) */}
                <svg width="160" height="220" viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Friendly doctor illustration">
                  <defs>
                    <linearGradient id="g1" x1="0" x2="1">
                      <stop offset="0%" stopColor="#6EE7B7" />
                      <stop offset="100%" stopColor="#60A5FA" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="160" height="220" rx="14" fill="white" fillOpacity="0.02" />
                  {/* body */}
                  <g transform="translate(30,18)">
                    {/* legs */}
                    <rect x="18" y="132" width="10" height="36" rx="4" fill="#3B82F6" />
                    <rect x="46" y="132" width="10" height="36" rx="4" fill="#3B82F6" />
                    {/* shoes */}
                    <ellipse cx="23" cy="172" rx="8" ry="4" fill="#111827" />
                    <ellipse cx="51" cy="172" rx="8" ry="4" fill="#111827" />
                    {/* coat */}
                    <path d="M6 80c0-6 6-16 34-16s34 10 34 16v44c0 6-6 10-12 10H18c-6 0-12-4-12-10V80z" fill="#FFFFFF" />
                    {/* stethoscope */}
                    <path d="M36 90c0 0 0-10 6-12" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
                    <path d="M48 78c8 4 10 10 10 18" stroke="#9CA3AF" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="54" cy="120" r="6" fill="#9CA3AF" />
                    {/* head */}
                    <circle cx="36" cy="36" r="24" fill="#FFDAB9" />
                    {/* hair */}
                    <path d="M16 24c6-12 36-18 48-6c4 4 6 14 2 20c-6 10-34 12-50-2z" fill="#3B3838" opacity="0.95" />
                    {/* eyes */}
                    <circle cx="28" cy="32" r="3" fill="#111827" />
                    <circle cx="44" cy="32" r="3" fill="#111827" />
                    {/* smile */}
                    <path d="M28 44c3 3 9 3 12 0" stroke="#111827" strokeWidth="2" strokeLinecap="round" />
                    {/* badge */}
                    <rect x="10" y="96" width="20" height="12" rx="3" fill="#EEF2FF" />
                    <text x="18" y="104" fontSize="7" fill="#3B82F6" fontWeight="700">DR</text>
                  </g>
                </svg>
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-white/90">Because your health deserves thoughtful, friendly care.</div>
        </div>

        <div className="p-6 bg-white dark:bg-gray-900">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-gray-100">Send app link</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">Enter a phone number to receive a link to the HerCycle app or your report.</p>

          <div className="mt-5">
            <label className="text-sm text-gray-600">Mobile number</label>
            <div className="mt-2 flex gap-2">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border rounded-lg px-3 py-2 w-28">
                <select value="+91" className="bg-transparent outline-none text-sm">
                  <option>+91</option>
                  <option>+1</option>
                  <option>+44</option>
                </select>
              </div>
              <input value={phone} onChange={(e)=>{ setPhone(e.target.value); setSent(false) }} placeholder="Enter mobile number" className="flex-1 border rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-pink-400" />
            </div>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={sendAppLink} disabled={loading} className="inline-flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg shadow">
              {loading ? 'Sending…' : 'Send App Link'}
            </button>
            <a target="_blank" rel="noreferrer" href="https://www.google.com/search?q=gynecologist+near+me" className="px-4 py-2 border rounded-lg text-sm">Find local doctors</a>
          </div>

          {sent && <div className="mt-3 text-sm text-green-600">Link sent — check your phone.</div>}

          <div className="mt-6 text-xs text-gray-500">We’ll never share your phone number — messages are sent securely.</div>
        </div>
      </div>
    </div>
  )
}

  function Feature({ icon, title, desc }){
    return (
      <div className="bg-white/10 rounded-lg p-3 flex flex-col items-start gap-2">
        <div className="w-10 h-10 flex items-center justify-center rounded-md bg-white/20 text-xl">{icon}</div>
        <div className="font-medium">{title}</div>
        <div className="text-xs text-white/90">{desc}</div>
      </div>
    )
  }
