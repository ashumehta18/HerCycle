import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

const slidesDefault = [
  {
    title: 'Period Tracker',
    text: 'Understand your cycle and plan ahead with simple, clear predictions.',
    cta: { label: 'Open Tracker', to: '/tracker' },
    img: 'https://picsum.photos/id/1062/1600/700',
  },
  {
    title: 'Mood & Symptoms',
    text: 'Log your mood and symptoms daily—see gentle trends over time.',
    cta: { label: 'Go to Dashboard', to: '/dashboard' },
    img: 'https://picsum.photos/id/1080/1600/700',
  },
  {
    title: 'PCOS Risk Check',
    text: 'A quick, informative check to help you reflect on common PCOS markers.',
    cta: { label: 'Run PCOS Check', to: '/pcos' },
    img: 'https://picsum.photos/id/1027/1600/700',
  },
  {
    title: 'Wellness Reminders',
    text: 'Stay prepared with gentle reminders around period and fertile windows.',
    cta: { label: 'View Reminders', to: '/dashboard' },
    img: 'https://picsum.photos/id/1074/1600/700',
  },
  {
    title: 'Friendly Chatbot',
    text: 'Ask questions and get supportive, general guidance 24/7.',
    cta: { label: 'Chat now', to: '/chatbot' },
    img: 'https://picsum.photos/id/237/1600/700',
  },
]

export default function HeroCarousel({ slides = slidesDefault, interval = 5000 }){
  const [index, setIndex] = useState(0)
  const timer = useRef(null)

  useEffect(()=>{
    timer.current = setInterval(()=> setIndex(i => (i+1)%slides.length), interval)
    return ()=> clearInterval(timer.current)
  },[slides.length, interval])

  const prev = ()=> setIndex((index - 1 + slides.length) % slides.length)
  const next = ()=> setIndex((index + 1) % slides.length)

  const slide = slides[index]

  return (
    <div className="relative w-full overflow-hidden rounded-xl shadow">
      <img src={slide.img} alt={slide.title} className="w-full h-[320px] sm:h-[420px] md:h-[520px] object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 text-white">
        <h2 className="text-3xl md:text-5xl font-extrabold drop-shadow">{slide.title}</h2>
        <p className="mt-2 max-w-2xl text-sm md:text-base drop-shadow">{slide.text}</p>
        <div className="mt-4">
          <Link to={slide.cta.to} className="inline-block bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded shadow">
            {slide.cta.label}
          </Link>
        </div>
      </div>

      <button aria-label="Previous" onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow">‹</button>
      <button aria-label="Next" onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-700 rounded-full w-9 h-9 flex items-center justify-center shadow">›</button>

      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i)=> (
          <button key={i} onClick={()=>setIndex(i)} aria-label={`Go to slide ${i+1}`}
            className={`h-2.5 w-2.5 rounded-full ${i===index? 'bg-white' : 'bg-white/50 hover:bg-white/80'}`} />
        ))}
      </div>
    </div>
  )
}
