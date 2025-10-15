import React, { useEffect } from 'react'

export default function DayModal({ open, date, value = {}, onClose, onSave }){
  const [form, setForm] = React.useState({ period:false, flow:'medium', pain:3, notes:'' })

  useEffect(()=>{
    if(date){
      setForm({ period: !!value.period, flow: value.flow||'medium', pain: value.pain||3, notes: value.notes||'' })
    }
  },[date, value])

  if(!open) return null

  const save = ()=>{
    onSave && onSave(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md shadow-lg">
        <h3 className="font-semibold">Edit {date ? new Date(date).toDateString() : ''}</h3>
        <div className="mt-3 space-y-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.period} onChange={e=>setForm(f=>({...f,period:e.target.checked}))} /> Today is a period day</label>
          <div className="flex items-center gap-2">
            <label className="text-sm">Flow</label>
            <select className="border rounded p-1" value={form.flow} onChange={e=>setForm(f=>({...f,flow:e.target.value}))}>
              <option value="light">light</option>
              <option value="medium">medium</option>
              <option value="heavy">heavy</option>
            </select>
          </div>
          <div>
            <label className="text-sm">Pain: {form.pain}</label>
            <input type="range" min="0" max="10" value={form.pain} onChange={e=>setForm(f=>({...f,pain: Number(e.target.value)}))} className="w-full" />
          </div>
          <div>
            <label className="text-sm">Notes</label>
            <textarea className="w-full border rounded p-2" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border">Cancel</button>
          <button onClick={save} className="px-3 py-1 rounded bg-primary-500 text-white">Save</button>
        </div>
      </div>
    </div>
  )
}
