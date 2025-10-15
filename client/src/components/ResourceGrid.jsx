import { Link } from 'react-router-dom'

const defaultItems = [
  { title:'What is PCOS?', to:'/pcos', img:'https://picsum.photos/id/1012/640/420' },
  { title:'What’s new in PCOS', to:'/pcos', img:'https://picsum.photos/id/1035/640/420' },
  { title:'How is PCOS diagnosed', to:'/pcos', img:'https://picsum.photos/id/1005/640/420' },
  { title:'PCOS and psychological wellbeing', to:'/pcos', img:'https://picsum.photos/id/1021/640/420' },
  { title:'PCOS and insulin', to:'/pcos', img:'https://picsum.photos/id/1040/640/420' },
  { title:'PCOS key messages', to:'/pcos', img:'https://picsum.photos/id/1059/640/420' },
  { title:'What are the symptoms of PCOS?', to:'/pcos', img:'https://picsum.photos/id/1016/640/420' },
  { title:'What causes PCOS?', to:'/pcos', img:'https://picsum.photos/id/1037/640/420' },
  { title:'AMH and PCOS', to:'/pcos', img:'https://picsum.photos/id/1060/640/420' },
]

export default function ResourceGrid({ items = defaultItems, title='Causes, diagnosis and symptoms', subtitle='You will find information on known causes of PCOS, how a diagnosis is made and how to manage PCOS symptoms.' }){
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {items.map((it, i)=> (
          <article key={i} className="rounded-xl overflow-hidden border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
            <Link to={it.to}>
              <div className="h-40 md:h-44 overflow-hidden">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{it.title}</h3>
                <button className="mt-2 inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700 hover:bg-blue-100">Read more</button>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  )
}
