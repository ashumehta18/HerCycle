import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

export default function PCOS(){
  const { token } = useSelector(s=>s.auth)
  const [form, setForm] = useState({ cycleIrregularity:false, acne:false, hirsutism:false, weightGain:false, insulinResistance:false, familyHistory:false })
  const [result, setResult] = useState(null)
  const submit = async (e)=>{
    e.preventDefault()
    const { data } = await api.post('/pcos/analyze', form, { headers:{ Authorization:`Bearer ${token}` } })
    setResult(data)
  }
  return (
    <div className="max-w-xl mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-semibold">PCOS Risk Analyzer</h2>
      <form className="space-y-2" onSubmit={submit}>
        {Object.keys(form).map(k=> (
          <label key={k} className="flex items-center gap-2">
            <input type="checkbox" checked={form[k]} onChange={e=>setForm({...form,[k]:e.target.checked})} />
            <span className="capitalize">{k.replace(/([A-Z])/g,' $1')}</span>
          </label>
        ))}
        <button className="bg-primary-500 text-white p-2 rounded">Check Risk</button>
      </form>
      {result && <div className="p-4 bg-white rounded shadow">Risk: <b>{result.risk}</b> (Score: {result.score})</div>}
    </div>
  )
}
