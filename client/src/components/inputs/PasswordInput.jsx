import { useState } from 'react'

export default function PasswordInput({ label = 'Password', value, onChange, placeholder, error, showStrength, strength }) {
  const [show, setShow] = useState(false)
  const level = showStrength ? (strength?.level || 0) : 0
  const levelColors = ['bg-red-400','bg-orange-400','bg-yellow-400','bg-lime-400','bg-green-500']
  const levelTexts = ['Very weak','Weak','Okay','Good','Strong']
  return (
    <div>
      <label className="block">
        {label && <span className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-1">{label}</span>}
        <div className={
          `flex items-center rounded-lg border bg-white dark:bg-gray-900/70 ` +
          (error ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400' : 'border-gray-300 dark:border-gray-700 focus-within:ring-2 focus-within:ring-pink-400')
        }>
          <input
            type={show ? 'text' : 'password'}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            autoComplete="new-password"
            className="flex-1 px-3 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none"
          />
          <button type="button" className="px-3 py-2 text-sm text-pink-600 hover:text-pink-700" onClick={()=>setShow(s=>!s)}>
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </label>
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
      {showStrength && (
        <div className="mt-2">
          <div className="flex gap-1 mb-1">
            {[0,1,2,3,4].map(i=> (
              <div key={i} className={`h-1.5 flex-1 rounded ${i<=level-1 ? levelColors[level-1] : 'bg-gray-200 dark:bg-gray-700'}`}></div>
            ))}
          </div>
          <span className={`text-xs ${level>=3?'text-green-600':'text-gray-600 dark:text-gray-400'}`}>{level ? levelTexts[level-1] : 'Start typing a strong password'}</span>
        </div>
      )}
    </div>
  )
}
