import React from 'react'

export default function DashboardIllustration({ className = '' }){
  return (
    <div className={`pointer-events-none absolute inset-y-0 right-0 hidden lg:flex items-center justify-center pr-8 ${className}`} aria-hidden="true">
      <svg width="360" height="420" viewBox="0 0 360 420" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffd7e0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#fff1f3" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        <rect x="20" y="40" rx="24" width="320" height="360" fill="url(#g1)" />
        <g transform="translate(48,80) scale(0.9)" fill="#fff">
          <circle cx="120" cy="40" r="26" fill="#ff7b9c" opacity="0.9" />
          <rect x="20" y="120" width="200" height="8" rx="4" fill="#ffd7e0" />
          <rect x="20" y="140" width="160" height="8" rx="4" fill="#ffd7e0" />
          <rect x="20" y="160" width="120" height="8" rx="4" fill="#ffd7e0" />
          <ellipse cx="120" cy="240" rx="64" ry="22" fill="#ffb6c9" opacity="0.9" />
        </g>
      </svg>
    </div>
  )
}
