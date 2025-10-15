import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
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
          className={`p-2 rounded border text-left ${value===m.key?'bg-primary-100 border-primary-400':'hover:bg-pink-50'}`}>
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

  // Load local mood history
  useEffect(()=>{
    const h = localStorage.getItem('moodHistory')
    if(h) setMoodHistory(JSON.parse(h))
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

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
          <p className="text-sm text-gray-600">"Your cycle, your rhythm — we've got you."</p>
        </div>
        <a href="/tracker" className="bg-primary-500 text-white px-3 py-2 rounded">+ Add cycle</a>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded p-4 shadow">
          <h3 className="font-semibold mb-3">How are you feeling today?</h3>
          <MoodSelector value={moodToday} onChange={saveMood} />
          {moodToday && <p className="mt-2 text-sm text-gray-600">Logged mood: <b className="capitalize">{moodToday}</b></p>}
          <div className="mt-4">
            <Line data={chartData} options={{ scales:{ y:{ min:0, max:5 }}}} />
          </div>
        </div>

        <div className="bg-white rounded p-4 shadow">
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
        </div>
      </section>
    </div>
  )
}
