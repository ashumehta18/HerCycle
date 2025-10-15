import AuthLayout from '../components/AuthLayout'
import TextInput from '../components/inputs/TextInput'
import { useState } from 'react'

export default function ForgotPassword(){
  const [email, setEmail] = useState('')
  const disabled = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  return (
    <AuthLayout title="Reset your password" subtitle="Enter your email and we'll send a reset link.">
      <form className="space-y-4" onSubmit={(e)=>{e.preventDefault(); /* TODO: integrate API */}}>
        <TextInput label="Email" type="email" placeholder="you@example.com" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="w-full rounded-lg bg-pink-600 hover:bg-pink-700 text-white py-2.5 font-medium transition disabled:opacity-60" disabled={disabled}>Send reset link</button>
        <p className="text-xs text-gray-600 dark:text-gray-400 text-center">For the demo, this is a placeholder screen.</p>
      </form>
    </AuthLayout>
  )
}
