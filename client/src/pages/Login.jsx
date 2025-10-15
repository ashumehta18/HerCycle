import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../redux/slices/authSlice'
import { Navigate, useLocation } from 'react-router-dom'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()
  const { token, status, error } = useSelector(s=>s.auth)
  const loc = useLocation()
  if(token) return <Navigate to={loc.state?.from?.pathname || '/dashboard'} replace />
  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <form className="space-y-3" onSubmit={e=>{e.preventDefault();dispatch(loginThunk({email,password}))}}>
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="w-full bg-primary-500 text-white p-2 rounded" disabled={status==='loading'}>{status==='loading'?'Loading...':'Login'}</button>
      </form>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </div>
  )
}
