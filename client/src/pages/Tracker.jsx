import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

export default function Tracker(){
  const { token } = useSelector(s=>s.auth)
  const [cycles, setCycles] = useState([])
  const [prediction, setPrediction] = useState(null)
  const [fertile, setFertile] = useState(null)
  const [form, setForm] = useState({ startDate:'', endDate:'', flow:'medium', pain:3, mood:'', notes:'' })

  useEffect(()=>{(async()=>{
    const { data } = await api.get('/tracker/dashboard', { headers:{ Authorization:`Bearer ${token}` } })
    setCycles(data.cycles); setPrediction(data.prediction); setFertile(data.fertile)
  })()},[token])

  const submit = async (e)=>{
    e.preventDefault()
    const { data } = await api.post('/tracker/cycles', form, { headers:{ Authorization:`Bearer ${token}` } })
    setCycles(data.cycles); setPrediction(data.prediction); setFertile(data.fertile)
    setForm({ startDate:'', endDate:'', flow:'medium', pain:3, mood:'', notes:'' })
  }

  const labels = cycles.map(c=> new Date(c.startDate).toLocaleDateString())
  const dataSet = cycles.map(c=> (new Date(c.endDate)-new Date(c.startDate))/(1000*60*60*24))

  const chartData = { labels, datasets:[{ label:'Period Length (days)', data:dataSet, borderColor:'#f43f5e', backgroundColor:'#fecdd8' }] }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Period Tracker</h2>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-3" onSubmit={submit}>
        <input type="date" className="border p-2 rounded" value={form.startDate} onChange={e=>setForm({...form,startDate:e.target.value})} />
        <input type="date" className="border p-2 rounded" value={form.endDate} onChange={e=>setForm({...form,endDate:e.target.value})} />
        <select className="border p-2 rounded" value={form.flow} onChange={e=>setForm({...form,flow:e.target.value})}>
          <option>light</option><option>medium</option><option>heavy</option>
        </select>
        <input type="number" min="0" max="10" className="border p-2 rounded" value={form.pain} onChange={e=>setForm({...form,pain:Number(e.target.value)})} />
        <input className="border p-2 rounded" placeholder="Mood" value={form.mood} onChange={e=>setForm({...form,mood:e.target.value})} />
        <input className="border p-2 rounded" placeholder="Notes" value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} />
        <button className="bg-primary-500 text-white p-2 rounded md:col-span-2">Add Cycle</button>
      </form>

      <div className="bg-white rounded p-4 shadow">
        <Line data={chartData} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded bg-white shadow">
          <h3 className="font-semibold">Next Period</h3>
          <p>{prediction? new Date(prediction.nextStart).toDateString(): 'Insufficient data'}</p>
        </div>
        <div className="p-4 rounded bg-white shadow">
          <h3 className="font-semibold">Fertile Window</h3>
          <p>{fertile? `${new Date(fertile.start).toDateString()} - ${new Date(fertile.end).toDateString()}`: 'Insufficient data'}</p>
        </div>
      </div>
    </div>
  )
}
