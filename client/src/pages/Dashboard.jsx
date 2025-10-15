import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { toast } from 'react-toastify'
import Tilt3D from '../components/Tilt3D'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

function MoodSelector({ onChange, value }){
  const moods = [
    { key:'happy', label:'😊 Happy' },
    { key:'calm', label:'🙂 Calm' },
    { key:'moody', label:'😕 Moody' },
    { key:'tired', label:'🥱 Tired' },
    { key:'crampy', label:'🤕 Crampy' },
    { key:'energized', label:'⚡ Energized' },
  ]
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {moods.map(m=> (
        <button key={m.key} onClick={()=>onChange(m.key)}
          className={`p-2 rounded-full border text-left transition shadow-sm ${value===m.key?'bg-pink-100 border-pink-400 ring-1 ring-pink-300':'hover:bg-pink-50 border-gray-200'}`}>
          {m.label}
        </button>
      ))}
    </div>
  )
}

export default function Dashboard(){
  const { token, user } = useSelector(s=>s.auth)
  const [reminders, setReminders] = useState([])
  const [moodToday, setMoodToday] = useState('')
  const [moodHistory, setMoodHistory] = useState([]) // [{date:'YYYY-MM-DD', mood:'happy'}]
  const [moodNote, setMoodNote] = useState('')
  const [symptomsToday, setSymptomsToday] = useState([]) // ['cramps','headache']
  const [symptomHistory, setSymptomHistory] = useState([]) // [{date, symptoms:[] }]
  const [quickLog, setQuickLog] = useState({ period:false, flow:'medium', pain:3 })
  const [dailyLogs, setDailyLogs] = useState({}) // { 'YYYY-MM-DD': { period, flow, pain } }

  // Load local mood history
  useEffect(()=>{
    const h = localStorage.getItem('moodHistory')
    if(h) setMoodHistory(JSON.parse(h))
    const s = localStorage.getItem('symptomHistory')
    if(s) setSymptomHistory(JSON.parse(s))
    const today = new Date().toISOString().slice(0,10)
    const notes = JSON.parse(localStorage.getItem('moodNotes') || '{}')
    if(notes[today]) setMoodNote(notes[today])
  const daily = JSON.parse(localStorage.getItem('dailyLogs') || '{}')
  setDailyLogs(daily)
  if(daily[today]) setQuickLog(daily[today])
  },[])

  // Fetch reminders but tolerate API unavailability
  useEffect(()=>{(async()=>{
    try{
      const { data } = await api.get('/reminders', { headers:{ Authorization:`Bearer ${token}` } })
      setReminders(data)
    }catch(e){
      // graceful fallback placeholder
      setReminders([{
        type:'wellness', message:'Drink water and stretch today 💧', date:new Date().toISOString(), sent:false
      }])
    }
  })()},[token])

  const saveMood = (m)=>{
    setMoodToday(m)
    const today = new Date()
    const key = today.toISOString().slice(0,10)
    const next = [...moodHistory.filter(x=>x.date!==key), { date:key, mood:m }]
    setMoodHistory(next)
    localStorage.setItem('moodHistory', JSON.stringify(next))
  }

  const saveMoodNote = ()=>{
    const today = new Date().toISOString().slice(0,10)
    const notes = JSON.parse(localStorage.getItem('moodNotes') || '{}')
    notes[today] = moodNote
    localStorage.setItem('moodNotes', JSON.stringify(notes))
  }

  const toggleSymptom = (key)=>{
    const today = new Date().toISOString().slice(0,10)
    const current = new Set(symptomsToday)
    if(current.has(key)) current.delete(key); else current.add(key)
    const updated = Array.from(current)
    setSymptomsToday(updated)
    const next = [...symptomHistory.filter(x=>x.date!==today), { date: today, symptoms: updated }]
    setSymptomHistory(next)
    localStorage.setItem('symptomHistory', JSON.stringify(next))
  }

  const saveQuickLog = ()=>{
    const today = new Date().toISOString().slice(0,10)
    const daily = JSON.parse(localStorage.getItem('dailyLogs') || '{}')
    daily[today] = quickLog
    localStorage.setItem('dailyLogs', JSON.stringify(daily))
    setDailyLogs(daily)
    toast.success('Saved today\'s quick log')
  }

  const chartData = useMemo(()=>{
    const last14 = [...moodHistory].sort((a,b)=> a.date.localeCompare(b.date)).slice(-14)
    const labels = last14.map(x=> x.date.slice(5))
    const moodScore = { happy:5, energized:4, calm:3, moody:2, tired:2, crampy:1 }
    const scores = last14.map(x=> moodScore[x.mood] || 0)
    return {
      labels,
      datasets:[{
        label:'Mood trend (14 days)',
        data:scores,
        borderColor:'#f43f5e',
        backgroundColor:'#fecdd8',
      }]
    }
  },[moodHistory])

  const symptomChart = useMemo(()=>{
    const last14 = [...symptomHistory].sort((a,b)=> a.date.localeCompare(b.date)).slice(-14)
    const labels = last14.map(x=> x.date.slice(5))
    const symptomKeys = ['cramps','headache','bloating','acne','fatigue']
    const counts = symptomKeys.map(k=> last14.reduce((acc, d)=> acc + (d.symptoms?.includes(k)?1:0), 0))
    return {
      labels: symptomKeys.map(k=> k),
      datasets:[{
        label:'Symptom frequency (last 14 days)',
        data: counts,
        borderColor:'#0ea5e9',
        backgroundColor:'#bae6fd'
      }]
    }
  },[symptomHistory])

  const painFlowChart = useMemo(()=>{
    const entries = Object.entries(dailyLogs)
      .map(([date, v]) => ({ date, ...v }))
      .sort((a,b)=> a.date.localeCompare(b.date))
      .slice(-14)
    const labels = entries.map(e=> e.date.slice(5))
    const pain = entries.map(e=> typeof e.pain === 'number' ? e.pain : 0)
    const flowMap = { light:1, medium:2, heavy:3 }
    const flow = entries.map(e=> flowMap[e.flow] || 0)
    return {
      labels,
      datasets:[
        {
          label:'Pain (0-10)',
          data: pain,
          borderColor:'#ef4444',
          backgroundColor:'#fecaca',
          yAxisID: 'y',
        },
        {
          label:'Flow level (1-3)',
          data: flow,
          borderColor:'#3b82f6',
          backgroundColor:'#bfdbfe',
          borderDash:[6,4],
          yAxisID: 'y1',
        }
      ]
    }
  },[dailyLogs])

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Period Mood Booster */}
      <Tilt3D maxTilt={14} scale={1.03}>
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white p-5 shadow-xl ring-1 ring-white/10">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute bottom-0 right-0 w-28 h-28 rounded-full bg-white/10 blur-xl" />
        <div className="relative">
          <h2 className="text-xl sm:text-2xl font-semibold">Hey {user?.name?.split(' ')[0] || 'there'}, let’s lift your mood 💗</h2>
          <p className="text-sm text-white/90 mt-1">Pick one tiny action now—your future self will thank you.</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button onClick={()=>{ setMoodToday('calm'); saveMood('calm') }} className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur">1 min deep breaths</button>
            <button onClick={()=>{ setQuickLog(q=>({...q, pain: Math.max(0,(q?.pain||0)-1)})); }} className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur">Warm compress</button>
            <button onClick={()=>{ setMoodNote('Grateful for…'); }} className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur">Note 1 gratitude</button>
            <a href="#quick-log" className="px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur">Save today’s log</a>
          </div>
        </div>
      </div>
      </Tilt3D>
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-600">"Your cycle, your rhythm — we've got you."</p>
        </div>
        <a href="/tracker" className="bg-primary-500 text-white px-3 py-2 rounded">+ Add cycle</a>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tilt3D glare={false}><div className="md:col-span-2 bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100">
          <h3 className="font-semibold mb-3">How are you feeling today?</h3>
          <MoodSelector value={moodToday} onChange={saveMood} />
          {moodToday && <p className="mt-2 text-sm text-gray-600">Logged mood: <b className="capitalize">{moodToday}</b></p>}
          <div className="mt-3">
            <textarea value={moodNote} onChange={e=>setMoodNote(e.target.value)}
              placeholder="Add a short note about your day (optional)" className="w-full border rounded p-2" rows={2} />
            <button onClick={saveMoodNote} className="mt-2 px-3 py-1 rounded bg-gray-800 text-white text-sm">Save note</button>
          </div>
          <div className="mt-4">
            <Line data={chartData} options={{ scales:{ y:{ min:0, max:5 }}}} />
          </div>
        </div></Tilt3D>

        <Tilt3D glare={false}><div className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100">
          <h3 className="font-semibold mb-2">Upcoming Reminders</h3>
          <ul className="space-y-2">
            {reminders.map((r,i)=> (
              <li key={i} className="border p-2 rounded">
                <div className="text-sm">{r.message}</div>
                <div className="text-xs text-gray-500">{new Date(r.date).toDateString()}</div>
              </li>
            ))}
            {!reminders.length && <li className="text-gray-500">No reminders yet.</li>}
          </ul>
        </div></Tilt3D>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tilt3D glare={false}><div className="md:col-span-2 bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100">
          <h3 className="font-semibold mb-3">Symptoms today</h3>
          <div className="flex flex-wrap gap-2">
            {['cramps','headache','bloating','acne','fatigue'].map(s => (
              <button key={s} onClick={()=>toggleSymptom(s)}
                className={`px-3 py-1 rounded border capitalize ${symptomsToday.includes(s)?'bg-blue-100 border-blue-400':'hover:bg-blue-50'}`}>
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Toggles are saved locally for now.</p>
        </div></Tilt3D>
        <Tilt3D glare={false}><div className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100">
          <h3 className="font-semibold mb-2">Symptom frequency</h3>
          <Line data={symptomChart} options={{ plugins:{ legend:{ display:false }}, scales:{ y:{ beginAtZero:true }}}} />
        </div></Tilt3D>
        <Tilt3D glare={false}><div className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100">
          <h3 className="font-semibold mb-2">Today’s wellness tip</h3>
          <p className="text-sm text-gray-700">{useMemo(()=>{
            const tips = [
              'Sip water regularly and take 5 deep breaths.',
              'Gentle stretching can ease cramps and boost mood.',
              'Prioritize sleep—aim for 7–9 hours tonight.',
              'Short walk outdoors: sunlight helps your rhythm.',
              'Balanced snack: protein + fiber to steady energy.',
              'Warm compress can soothe abdominal discomfort.',
              'Limit caffeine late in the day to improve rest.'
            ]
            const dayIndex = Math.floor(new Date().getTime()/(1000*60*60*24)) % tips.length
            return tips[dayIndex]
          },[])}</p>
        </div></Tilt3D>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tilt3D glare={false}><div className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100 md:col-span-3">
          <h3 className="font-semibold mb-3">Quick log (today)</h3>
          <div id="quick-log" className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <label className="flex items-center gap-2 border rounded p-2">
              <input type="checkbox" checked={quickLog.period} onChange={e=>setQuickLog({...quickLog, period: e.target.checked})} />
              <span>Today is a period day</span>
            </label>
            <select className="border rounded p-2" value={quickLog.flow} onChange={e=>setQuickLog({...quickLog, flow: e.target.value})}>
              <option value="light">Flow: light</option>
              <option value="medium">Flow: medium</option>
              <option value="heavy">Flow: heavy</option>
            </select>
            <div className="border rounded p-2">
              <label className="text-sm text-gray-600">Pain: {quickLog.pain}</label>
              <input type="range" min="0" max="10" value={quickLog.pain} onChange={e=>setQuickLog({...quickLog, pain: Number(e.target.value)})} className="w-full" />
            </div>
            <button onClick={saveQuickLog} className="bg-primary-500 text-white rounded px-3 py-2">Save quick log</button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Saved locally for now. We can sync this to your account later.</p>
        </div></Tilt3D>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Tilt3D glare={false}><div className="bg-white rounded-xl p-4 shadow-lg ring-1 ring-gray-100 md:col-span-3">
          <h3 className="font-semibold mb-3">Pain & flow trend (14 days)</h3>
          <Line data={painFlowChart} options={{
            responsive: true,
            interaction: { mode:'index', intersect:false },
            stacked: false,
            scales: {
              y: { type: 'linear', display: true, position: 'left', min:0, max:10 },
              y1: { type: 'linear', display: true, position: 'right', min:0, max:3, grid: { drawOnChartArea: false } },
            }
          }} />
        </div></Tilt3D>
      </section>
    </div>
  )
}
