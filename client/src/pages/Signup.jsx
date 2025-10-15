import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupThunk } from '../redux/slices/authSlice'
import { Link, Navigate } from 'react-router-dom'
import AuthSplitLayout from '../components/AuthSplitLayout'
import TextInput from '../components/inputs/TextInput'
import PasswordInput from '../components/inputs/PasswordInput'
import { getPasswordStrength } from '../utils/passwordStrength'

export default function Signup(){
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [touched, setTouched] = useState(false)
  const dispatch = useDispatch()
  const { token, status, error } = useSelector(s=>s.auth)
  if(token) return <Navigate to="/dashboard" replace />
  const emailError = touched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter a valid email' : ''
  const nameError = touched && name.trim().length < 2 ? 'Enter your name' : ''
  const strength = getPasswordStrength(password)
  const passwordError = touched && strength.level < 3 ? 'Try a stronger password' : ''
  const disabled = status==='loading' || !!emailError || !!passwordError || !!nameError || !name || !email || !password
  return (
    <AuthSplitLayout
  leftImageUrl="/images/period-calendar-2.jpg"
      leftQuote="Periods don’t define women—they remind us of our rhythm, resilience, and the power to renew."
      leftQuoteAuthor="HerCycle"
      leftTitle="Welcome Page"
      leftSubtitle="Create your account to continue"
      formTitle="Create Account"
      formSubtitle="It only takes a minute."
    >
      <form className="space-y-4" onSubmit={e=>{e.preventDefault(); setTouched(true); if(!disabled){dispatch(signupThunk({name,email,password}))}}}>
        <TextInput label="Name" placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} error={nameError} autoComplete="name" />
        <TextInput label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} error={emailError} autoComplete="email" />
        <PasswordInput value={password} onChange={e=>setPassword(e.target.value)} placeholder="Use 8+ characters" error={passwordError} showStrength strength={strength} />
        {password && strength.suggestions?.length>0 && (
          <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
            {strength.suggestions.map((s,i)=> <li key={i}>• {s}</li>)}
          </ul>
        )}
        <button className="w-full rounded-lg bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white py-2.5 font-semibold tracking-wide shadow hover:opacity-95 transition disabled:opacity-60" disabled={disabled}>
          CONTINUE ➜
        </button>
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account? <Link to="/login" className="text-pink-600 hover:underline">Sign in</Link>
        </p>
      </form>
    </AuthSplitLayout>
  )
}
