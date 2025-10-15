import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'

export default function Navbar(){
  const { user } = useSelector(s=>s.auth)
  const dispatch = useDispatch()
  const [dark, setDark] = useState(()=> localStorage.getItem('theme')==='dark')

  useEffect(()=>{
    const root = document.documentElement
    if(dark){ root.classList.add('dark'); localStorage.setItem('theme','dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light') }
  },[dark])
  return (
    <nav className="px-4 py-3 bg-white/80 backdrop-blur sticky top-0 z-10 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-hand text-primary-600">HerCycle</Link>
        <div className="flex items-center gap-4">
          <Link to="/tracker" className="hover:text-primary-600">Tracker</Link>
          <Link to="/pcos" className="hover:text-primary-600">PCOS</Link>
          <Link to="/chatbot" className="hover:text-primary-600">Chatbot</Link>
          <button onClick={()=>setDark(v=>!v)} className="text-sm px-2 py-1 rounded border">
            {dark? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <Link to="/dashboard" className="hover:text-primary-600">Dashboard</Link>
              <button onClick={()=>dispatch(logout())} className="text-sm bg-primary-500 text-white px-3 py-1 rounded">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup" className="bg-primary-500 text-white px-3 py-1 rounded">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
