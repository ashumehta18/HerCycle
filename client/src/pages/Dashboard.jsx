import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

export default function Dashboard(){
  const { token, user } = useSelector(s=>s.auth)
  const [reminders, setReminders] = useState([])
  useEffect(()=>{(async()=>{
    const { data } = await api.get('/reminders', { headers:{ Authorization:`Bearer ${token}` } })
    setReminders(data)
  })()},[token])
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">Welcome, {user?.name}</h2>
      <div className="bg-white rounded p-4 shadow">
        <h3 className="font-semibold mb-2">Upcoming Reminders</h3>
        <ul className="space-y-2">
          {reminders.map((r,i)=> (
            <li key={i} className="border p-2 rounded flex items-center justify-between">
              <span>{r.message}</span>
              <span className="text-sm text-gray-500">{new Date(r.date).toDateString()}</span>
            </li>
          ))}
          {!reminders.length && <li className="text-gray-500">No reminders yet.</li>}
        </ul>
      </div>
    </div>
  )
}
