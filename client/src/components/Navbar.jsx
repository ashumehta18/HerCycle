import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../redux/slices/authSlice'
import Logo from './Logo'

export default function Navbar(){
  const { user } = useSelector(s=>s.auth)
  const dispatch = useDispatch()
  const [dark, setDark] = useState(()=> localStorage.getItem('theme')==='dark')
  const [open, setOpen] = useState(false)

  useEffect(()=>{
    const root = document.documentElement
    if(dark){ root.classList.add('dark'); localStorage.setItem('theme','dark') }
    else { root.classList.remove('dark'); localStorage.setItem('theme','light') }
  },[dark])
  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-white/80 to-pink-50 dark:from-gray-900/80 dark:to-gray-900/60 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3">
            <div className="rounded-full bg-white p-1 shadow-sm"><Logo /></div>
            <span className="font-semibold text-lg text-slate-800 dark:text-gray-100">HerCycle</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Nav to="/tracker" label="Tracker" />
            <Nav to="/pcos" label="PCOS" />
            <Nav to="/tips" label="Tips" />
            <Nav to="/chatbot" label="Chatbot" />
            <Nav to="/consult" label="Consult" />
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={()=>setDark(v=>!v)} aria-label="toggle theme" className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-lg border hover:shadow-sm">
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>

          <div className="hidden sm:flex items-center gap-3">
            <Link to="/dashboard" className="text-sm px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold">Dashboard</Link>
            <Link to="/report" className="text-sm px-4 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold">Report</Link>
          </div>

          {user ? (
            <div className="relative">
              <button onClick={()=>setOpen(v=>!v)} className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-600 text-white flex items-center justify-center shadow">
                {user.name ? user.name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase() : 'U'}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2">
                  <Link to="/dashboard" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Settings</Link>
                  <button onClick={()=>dispatch(logout())} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <NavLink to="/login" className="text-sm px-3 py-1 font-semibold">Login</NavLink>
              <Link to="/signup" className="text-sm px-4 py-2 bg-pink-600 text-white rounded-lg shadow font-semibold">Sign up</Link>
            </div>
          )}

          <button onClick={()=>setOpen(v=>!v)} className="md:hidden ml-2 p-2 rounded-md border">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-white dark:bg-gray-900">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Nav to="/tracker" label="Tracker" />
            <Nav to="/pcos" label="PCOS" />
            <Nav to="/tips" label="Tips" />
            <Nav to="/chatbot" label="Chatbot" />
            <Nav to="/consult" label="Consult" />
            {user ? (
              <>
                <Link to="/dashboard" className="px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold">Dashboard</Link>
                <button onClick={()=>dispatch(logout())} className="px-2 py-2 text-left rounded hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2 py-2 rounded hover:bg-gray-50 dark:hover:bg-gray-800 font-semibold">Login</Link>
                <Link to="/signup" className="px-4 py-2 rounded bg-pink-600 text-white text-center font-semibold">Sign up</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
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
