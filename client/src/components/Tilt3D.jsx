import { useEffect, useRef } from 'react'

export default function Tilt3D({
  children,
  className = '',
  maxTilt = 12,
  scale = 1.02,
  glare = true,
  disabled = false,
}){
  const wrapRef = useRef(null)
  const innerRef = useRef(null)
  const glareRef = useRef(null)
  let raf = null

  useEffect(()=>{
    const wrap = wrapRef.current
    const inner = innerRef.current
    if(!wrap || !inner) return
    if(disabled) return

    const onEnter = ()=>{
      inner.style.transition = 'transform 120ms ease-out'
    }
    const onMove = (e)=>{
      if(raf) cancelAnimationFrame(raf)
      raf = requestAnimationFrame(()=>{
        const rect = wrap.getBoundingClientRect()
        const px = (e.clientX - rect.left) / rect.width
        const py = (e.clientY - rect.top) / rect.height
        const rx = (py - 0.5) * -maxTilt
        const ry = (px - 0.5) * maxTilt
        inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(${scale})`
        if(glare && glareRef.current){
          glareRef.current.style.opacity = '1'
          glareRef.current.style.background = `radial-gradient(circle at ${px*100}% ${py*100}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)`
        }
      })
    }
    const onLeave = ()=>{
      inner.style.transition = 'transform 180ms ease-in'
      inner.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)'
      if(glare && glareRef.current){ glareRef.current.style.opacity = '0' }
    }
    wrap.addEventListener('mouseenter', onEnter)
    wrap.addEventListener('mousemove', onMove)
    wrap.addEventListener('mouseleave', onLeave)
    return ()=>{
      wrap.removeEventListener('mouseenter', onEnter)
      wrap.removeEventListener('mousemove', onMove)
      wrap.removeEventListener('mouseleave', onLeave)
      if(raf) cancelAnimationFrame(raf)
    }
  },[maxTilt, scale, glare, disabled])

  return (
    <div ref={wrapRef} className={`[perspective:1000px] ${className}`}>
      <div ref={innerRef} className="relative will-change-transform">
        {children}
        {glare && (
          <div ref={glareRef} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-150" />
        )}
      </div>
    </div>
  )
}
