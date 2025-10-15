import { Link } from 'react-router-dom'

const itemsDefault = [
  {
    title: 'Quick Log',
    text: 'Log period, flow, and pain in seconds on your dashboard.',
    to: '/dashboard',
    img: 'https://picsum.photos/id/1003/800/600',
  },
  {
    title: 'Cycle Insights',
    text: 'Get gentle predictions and simple charts of your cycle.',
    to: '/tracker',
    img: 'https://picsum.photos/id/1011/800/600',
  },
  {
    title: 'PCOS Analyzer',
    text: 'A supportive check to reflect on PCOS-related indicators.',
    to: '/pcos',
    img: 'https://picsum.photos/id/1025/800/600',
  },
  {
    title: 'Chat & Learn',
    text: 'Ask questions anytime—kind, general guidance when you need it.',
    to: '/chatbot',
    img: 'https://picsum.photos/id/1041/800/600',
  },
]

export default function FeatureCards({ items = itemsDefault }){
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((card, i)=> (
        <Link to={card.to} key={i} className="group rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow hover:shadow-lg transition-shadow">
          <div className="h-36 md:h-40 overflow-hidden">
            <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg">{card.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{card.text}</p>
            <span className="inline-block mt-3 text-primary-600 group-hover:translate-x-1 transition-transform">Explore →</span>
          </div>
        </Link>
      ))}
    </div>
  )
}
