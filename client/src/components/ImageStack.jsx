import { useState } from 'react'

export default function ImageStack({ images=[
  'https://picsum.photos/id/1027/420/300',
  'https://picsum.photos/id/1003/420/300',
  'https://picsum.photos/id/1080/420/300',
  'https://picsum.photos/id/1041/420/300',
] }){
  const [active, setActive] = useState(null)
  const visible = images.slice(0,3) // show 3 by default
  return (
    <div className="relative h-[480px] md:h-[520px]" onDoubleClick={()=>setActive(null)} onKeyDown={(e)=> e.key==='Escape' && setActive(null)}>
      {active !== null && (
        <div className="absolute inset-0 rounded-xl bg-black/10" onClick={()=>setActive(null)} />
      )}
      {visible.map((src, i)=> {
        const baseLeft = i*20; // ensure all are visible
        const baseTop = i*28;
        const isActive = active === i
        return (
          <div key={i}
               className={`absolute transition-all duration-300 will-change-transform ${isActive? 'z-50' : ''}`}
               style={{
                 left: isActive? 0 : `${baseLeft}px`,
                 top: isActive? 0 : `${baseTop}px`,
                 zIndex: isActive? 50 : 10+i,
               }}
          >
            <div
              role="button"
              tabIndex={0}
              onClick={()=> setActive(i)}
              onKeyDown={(e)=> (e.key==='Enter'||e.key===' ') && setActive(i)}
              className={`relative rounded-xl overflow-hidden shadow-lg group cursor-pointer ${isActive? 'ring-2 ring-pink-300' : ''}`}
            >
              <img src={src} alt="tip visual" className={`${isActive? 'w-64 md:w-80 h-80 md:h-96' : 'w-56 md:w-60 h-64 md:h-72'} object-cover`} />
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-transparent via-transparent to-pink-200/40" />
            </div>
          </div>
        )
      })}
      {/* hover lift per card */}
      <style>{`
        .relative > div:not(.z-50):hover { transform: translateY(-6px) rotate(-1deg) scale(1.015); }
      `}</style>
    </div>
  )
}
