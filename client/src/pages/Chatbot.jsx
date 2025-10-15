import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../utils/api'
import DecorativeBackground from '../components/DecorativeBackground'

export default function Chatbot(){
  const { token } = useSelector(s=>s.auth)
  const [messages, setMessages] = useState([
    { role:'system', content:'Start the conversation about your wellness.', time: Date.now() }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [status, setStatus] = useState({ loading: true, configured: false, provider: 'unknown', model: '' })
  const [error, setError] = useState('')
  const [typing, setTyping] = useState(false)
  const [lastRequest, setLastRequest] = useState(null)
  const scrollRef = useRef(null)

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
    if(e && e.preventDefault) e.preventDefault()
    setError('')
    const userMsg = input.trim()
    if(!userMsg) return
    setSending(true)
    const newMsgs = [...messages, { role:'user', content: userMsg, time: Date.now() }]
    setMessages(newMsgs)
    setInput('')
    setLastRequest({ messages: newMsgs.filter(m=>m.role!=='system') })
    try{
      setTyping(true)
      const { data } = await api.post('/chat', { messages: newMsgs.filter(m=>m.role!=='system') }, { headers:{ Authorization:`Bearer ${token}` } })
      setMessages(prev=>[...prev, { role:'assistant', content: data.reply, time: Date.now() }])
    }catch(e){
      const msg = e?.response?.data?.message || e.message || 'Failed to send message.'
      const detail = e?.response?.data?.detail
      setError(detail ? `${msg}: ${detail}` : msg)
      setMessages(prev=>[...prev, { role:'assistant', content: 'Sorry, I ran into an error processing that.', time: Date.now() }])
    }finally{
      setSending(false)
      setTyping(false)
    }
  }

  // Regenerate last assistant reply using lastRequest
  const regenerate = async ()=>{
    if(!lastRequest) return
    setError('')
    setSending(true)
    setTyping(true)
    try{
      const { data } = await api.post('/chat', { messages: lastRequest.messages || lastRequest }, { headers:{ Authorization:`Bearer ${token}` } })
      setMessages(prev=>[...prev, { role:'assistant', content: data.reply, time: Date.now() }])
    }catch(e){
      setError('Failed to regenerate answer')
    }finally{
      setSending(false)
      setTyping(false)
    }
  }

  useEffect(()=>{
    // auto-scroll to bottom when messages change
    const el = scrollRef.current
    if(el) el.scrollTop = el.scrollHeight
  },[messages, typing])

  const quickPrompts = [
    'How can I reduce acne with diet?',
    'What exercise helps hormonal balance?',
    'How do I prepare for a doctor visit?',
  ]

  return (
    <div className="relative max-w-3xl mx-auto p-6">
      <DecorativeBackground />
      <div className="flex items-start justify-between">
        <h2 className="text-2xl font-semibold mb-2">Wellness Chat</h2>
        <div className="text-sm text-gray-600">{status.loading ? 'Checking AI…' : status.configured ? `Using ${status.provider} ${status.model?`(${status.model})`:''}` : <span className="text-amber-600">AI not configured</span>}</div>
      </div>

      <div className="mt-2 mb-3 flex gap-2">
        {quickPrompts.map((q,i)=> (
          <button key={i} onClick={()=>{ setInput(q); }} className="text-sm px-3 py-1 rounded-full border bg-gray-50 hover:bg-gray-100">{q}</button>
        ))}
        <button onClick={regenerate} disabled={!lastRequest || sending} className="ml-auto text-sm px-3 py-1 rounded-full bg-primary-500 text-white">Regenerate</button>
      </div>

      <div ref={scrollRef} className="space-y-4 h-[60vh] overflow-auto bg-white p-4 rounded shadow">
        {messages.filter(m=>m.role!=='system').map((m,i)=> (
          <div key={i} className={`flex gap-3 ${m.role==='user' ? 'justify-end' : 'justify-start'}`}>
            {m.role==='assistant' && (
              <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">AI</div>
            )}
            <div className={`max-w-[75%] p-3 rounded-lg ${m.role==='user' ? 'bg-primary-500 text-white rounded-br-none' : 'bg-pink-50 text-gray-800 rounded-bl-none'}`}>
              <div className="text-sm whitespace-pre-wrap">{m.content}</div>
              <div className="text-xs text-gray-400 mt-1 text-right">{m.time ? new Date(m.time).toLocaleTimeString() : ''}</div>
            </div>
            {m.role==='user' && (
              <div className="w-9 h-9 rounded-full bg-primary-500 flex items-center justify-center text-white">U</div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-pink-700">AI</div>
            <div className="p-2 bg-pink-50 rounded-lg">
              <div className="h-3 w-20 bg-gray-200 rounded-full animate-pulse" />
            </div>
          </div>
        )}

        {!!error && <div className="text-sm text-red-600">{error}</div>}
      </div>

      <form className="mt-3 flex gap-2" onSubmit={send}>
        <input className="flex-1 border p-2 rounded" value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask about symptoms, lifestyle, or what to ask your doctor..." />
        <button className="bg-primary-500 text-white px-4 rounded disabled:opacity-50" disabled={sending || !input.trim()}>{sending ? 'Sending…' : 'Send'}</button>
      </form>
    </div>
  )
}
