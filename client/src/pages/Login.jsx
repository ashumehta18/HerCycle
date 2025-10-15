import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginThunk } from '../redux/slices/authSlice'
import { Link, Navigate, useLocation } from 'react-router-dom'
import AuthSplitLayout from '../components/AuthSplitLayout'
import TextInput from '../components/inputs/TextInput'
import PasswordInput from '../components/inputs/PasswordInput'

export default function Login(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const dispatch = useDispatch()
  const { token, status, error } = useSelector(s=>s.auth)
  const loc = useLocation()
  if(token) return <Navigate to={loc.state?.from?.pathname || '/dashboard'} replace />
  const emailError = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email' : ''
  const passwordError = touched && password.length < 6 ? 'At least 6 characters' : ''
  const disabled = status==='loading' || !!emailError || !!passwordError || !email || !password
  return (
    <AuthSplitLayout
  leftImageUrl="https://www.femmenest.com/app/assets/img/upload/175257869583870799.webp"
      leftQuote="Periods don’t define women—they remind us of our rhythm, resilience, and the power to renew."
      leftQuoteAuthor="HerCycle"
      leftTitle="Welcome Page"
      leftSubtitle="Sign in to continue access"
      formTitle="Sign In"
      formSubtitle="Use your HerCycle account to continue."
    >
      <form className="space-y-4" onSubmit={e=>{e.preventDefault(); setTouched(true); if(!disabled){dispatch(loginThunk({email,password}))}}}>
        <TextInput label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} error={emailError} autoComplete="email" />
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Password</span>
            <Link to="/forgot" className="text-xs text-pink-600 hover:underline">Forgot?</Link>
          </div>
          <PasswordInput value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" error={passwordError} />
        </div>
        <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white py-2.5 font-semibold tracking-wide shadow hover:opacity-95 transition disabled:opacity-60" disabled={disabled}>
          CONTINUE ➜
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-200 dark:border-gray-800" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white dark:bg-gray-900 px-3 text-xs text-gray-500">or Connect with Social Media</span>
          </div>
        </div>
        <div className="space-y-2">
          <button type="button" className="w-full flex items-center gap-3 rounded-lg bg-gradient-to-r from-sky-400 to-cyan-500 text-white py-2.5 px-3 font-medium shadow">
            <span className="text-lg">𝕏</span>
            <span className="flex-1 text-center">Sign In With Twitter</span>
          </button>
          <button type="button" className="w-full flex items-center gap-3 rounded-lg bg-gradient-to-r from-blue-500 to-sky-600 text-white py-2.5 px-3 font-medium shadow">
            <span className="text-lg">f</span>
            <span className="flex-1 text-center">Sign In With Facebook</span>
          </button>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          New here? <Link to="/signup" className="text-pink-600 hover:underline">Create an account</Link>
        </p>
      </form>
    </AuthSplitLayout>
  )
}
