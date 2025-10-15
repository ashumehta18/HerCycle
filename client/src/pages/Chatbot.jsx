import { useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

export default function Chatbot(){
  const { token } = useSelector(s=>s.auth)
  const [messages, setMessages] = useState([{ role:'system', content:'Start the conversation about your wellness.' }])
  const [input, setInput] = useState('')

  const send = async (e)=>{
    e.preventDefault()
    const newMsgs = [...messages, { role:'user', content: input }]
    setMessages(newMsgs)
    setInput('')
    const { data } = await api.post('/chat', { messages: newMsgs.filter(m=>m.role!=='system') }, { headers:{ Authorization:`Bearer ${token}` } })
    setMessages([...newMsgs, { role:'assistant', content: data.reply }])
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Chatbot</h2>
      <div className="space-y-2 h-[60vh] overflow-auto bg-white p-4 rounded shadow">
        {messages.filter(m=>m.role!=='system').map((m,i)=> (
          <div key={i} className={m.role==='user'? 'text-right': 'text-left'}>
            <span className={m.role==='user'? 'inline-block bg-primary-500 text-white px-3 py-2 rounded':'inline-block bg-pink-100 px-3 py-2 rounded'}>{m.content}</span>
          </div>
        ))}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={send}>
        <input className="flex-1 border p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." />
        <button className="bg-primary-500 text-white px-4 rounded">Send</button>
      </form>
    </div>
  )
}
