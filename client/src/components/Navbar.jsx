import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import Logo from './Logo'

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
    <nav className="px-4 py-3 bg-white/80 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-10 border-b">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <Logo />
        </Link>
        <div className="flex items-center gap-4">
          <Nav to="/tracker" label="Tracker" />
          <Nav to="/pcos" label="PCOS" />
          <Nav to="/tips" label="Tips" />
          <Nav to="/about" label="About" />
          <Nav to="/chatbot" label="Chatbot" />
          <button onClick={()=>setDark(v=>!v)} className="text-sm px-2 py-1 rounded border hover:bg-gray-50 dark:hover:bg-gray-800">
            {dark? 'Light' : 'Dark'}
          </button>
          {user ? (
            <>
              <Nav to="/dashboard" label="Dashboard" />
              <button onClick={()=>dispatch(logout())} className="text-sm bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded shadow">Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="hover:text-primary-600">Login</NavLink>
              <Link to="/signup" className="bg-primary-500 hover:bg-primary-600 text-white px-3 py-1 rounded shadow">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

function Nav({ to, label }){
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `px-2 py-1 rounded hover:text-primary-600 ${isActive ? 'text-primary-600 underline underline-offset-4' : ''}`
      }
    >
      {label}
    </NavLink>
  )
}
