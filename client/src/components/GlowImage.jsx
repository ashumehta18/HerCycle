export default function GlowImage({ src, alt='wellbeing image' }){
  return (
    <div className="group inline-block">
      <div className="relative rounded-xl overflow-hidden border-2 border-blue-200 shadow-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl">
        <img src={src} alt={alt} className="w-full max-w-sm h-40 md:h-48 object-cover" />
        <div className="absolute inset-0 ring-0 ring-blue-300/0 group-hover:ring-8 group-hover:ring-blue-300/30 transition-all" />
      </div>
    </div>
  )
}
