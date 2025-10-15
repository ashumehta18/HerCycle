import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'

export default function Chatbot(){
  const { token } = useSelector(s=>s.auth)
  const [messages, setMessages] = useState([{ role:'system', content:'Start the conversation about your wellness.' }])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ loading: true, configured: false, provider: 'unknown', model: '' })
  const [error, setError] = useState('')

  useEffect(()=>{
    let mounted = true
    ;(async ()=>{
      try{
        const { data } = await api.get('/chat/status')
        if(mounted) setStatus({ loading:false, ...data })
      }catch(e){
        if(mounted) setStatus({ loading:false, configured:false, provider:'unknown', model:'' })
      }
    })()
    return ()=>{ mounted=false }
  },[])

  const send = async (e)=>{
    e.preventDefault()
    setError('')
    setSending(true)
    const userMsg = input.trim()
    if(!userMsg){ setSending(false); return }
    const newMsgs = [...messages, { role:'user', content: userMsg }]
    setMessages(newMsgs)
    setInput('')
    try{
      const { data } = await api.post('/chat', { messages: newMsgs.filter(m=>m.role!=='system') }, { headers:{ Authorization:`Bearer ${token}` } })
      setMessages([...newMsgs, { role:'assistant', content: data.reply }])
    }catch(e){
      const msg = e?.response?.data?.message || e.message || 'Failed to send message.'
      const detail = e?.response?.data?.detail
      setError(detail ? `${msg}: ${detail}` : msg)
      setMessages([...newMsgs, { role:'assistant', content: 'Sorry, I ran into an error processing that.' }])
    }finally{
      setSending(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">AI Chatbot</h2>
      <div className="mb-3 text-sm text-gray-600">
        {status.loading ? 'Checking AI configuration…' : status.configured ? (
          <span>Using <b>{status.provider}</b> {status.model ? `(${status.model})` : ''}</span>
        ) : (
          <span className="text-amber-600">AI not configured—set OPENAI_API_KEY or GOOGLE_GEMINI_API_KEY or HUGGINGFACE_API_TOKEN in server/.env</span>
        )}
      </div>
      <div className="space-y-2 h-[60vh] overflow-auto bg-white p-4 rounded shadow">
        {messages.filter(m=>m.role!=='system').map((m,i)=> (
          <div key={i} className={m.role==='user'? 'text-right': 'text-left'}>
            <span className={m.role==='user'? 'inline-block bg-primary-500 text-white px-3 py-2 rounded':'inline-block bg-pink-100 px-3 py-2 rounded'}>{m.content}</span>
          </div>
        ))}
        {!!error && <div className="text-sm text-red-600">{error}</div>}
      </div>
      <form className="mt-3 flex gap-2" onSubmit={send}>
        <input className="flex-1 border p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type your message..." />
        <button className="bg-primary-500 text-white px-4 rounded disabled:opacity-50" disabled={sending || !input.trim()}>{sending ? 'Sending…' : 'Send'}</button>
      </form>
    </div>
  )
}
