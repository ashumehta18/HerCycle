import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupThunk } from '../redux/slices/authSlice'
import { Navigate } from 'react-router-dom'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { token, status, error } = useSelector(s=>s.auth)
  if(token) return <Navigate to="/dashboard" replace />
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Sign up</h2>
      <form className="space-y-3" onSubmit={e=>{e.preventDefault();dispatch(signupThunk({name,email,password}))}}>
        <input className="w-full border p-2 rounded" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-primary-500 text-white p-2 rounded" disabled={status==='loading'}>{status==='loading'?'Loading...':'Create account'}</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}
