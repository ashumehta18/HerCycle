import React from 'react'

export default function DecorativeBackground({ className = '', style = {} }){
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden -z-10 ${className}`}>
      <div className="absolute inset-0" style={{background: 'linear-gradient(135deg, rgba(255,245,246,0.85) 0%, rgba(255,230,235,0.6) 40%, rgba(255,240,240,0.35) 100%)', mixBlendMode: 'normal', opacity: 0.9, ...style}} />
      <div className="absolute -left-16 -top-14 w-72 h-72 rounded-full" style={{background: 'radial-gradient(circle at 30% 30%, rgba(255,200,205,0.14), transparent 40%)'}} />
      <div className="absolute -right-20 -bottom-16 w-96 h-96 rounded-full" style={{background: 'radial-gradient(circle at 70% 70%, rgba(255,150,160,0.08), transparent 35%)'}} />
    </div>
  )
}
