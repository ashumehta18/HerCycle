import { useMemo } from 'react'

const defaultBullets = [
  'Improve diet and physical activity for physical and mental health',
  'Prevent weight gain (really important goal)',
  'Modest weight loss if deemed relevant by women and clinicians',
]

const defaultTips = [
  { title:'Treat excess hair (hirsutism)', img:'https://picsum.photos/id/1027/640/420', to:'/pcos' },
  { title:'PCOS and emotional health', img:'https://picsum.photos/id/1003/640/420', to:'/pcos' },
  { title:'PCOS and diet', img:'https://picsum.photos/id/1080/640/420', to:'/pcos' },
  { title:'PCOS and exercise', img:'https://picsum.photos/id/1041/640/420', to:'/pcos' },
]

export default function HealthTipsGrid({ title='Manage your lifestyle', bullets=defaultBullets, tips=defaultTips }){
  const rows = useMemo(()=> tips, [tips])
  return (
    <section className="mt-10">
      <div className="mb-3 flex items-center justify-between flex-wrap gap-2">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <button className="text-sm inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100">Search all articles</button>
      </div>
      <p className="text-gray-600 dark:text-gray-300">Learn how to live the healthiest possible lifestyle to manage PCOS for you:</p>
      <ul className="list-disc ml-6 mt-2 text-gray-700 dark:text-gray-300 space-y-1">
        {bullets.map((b,i)=> <li key={i}>{b}</li>)}
      </ul>

      <div className="mt-4 grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
        {rows.map((card, i)=> (
          <a key={i} href={card.to} className="group block">
            <div className="relative rounded-2xl overflow-hidden border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-md transition-transform"
                 style={{perspective:'1000px'}}>
              <div className="transform-gpu transition-transform duration-300 group-hover:-rotate-x-2 group-hover:rotate-y-2">
                <img src={card.img} alt={card.title} className="w-full h-44 md:h-52 object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{card.title}</h3>
                <span className="mt-2 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700">Read more</span>
              </div>
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-tr from-transparent via-transparent to-emerald-100/30" />
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
