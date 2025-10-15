import HealthTipsGrid from '../components/HealthTipsGrid'
import ResourceGrid from '../components/ResourceGrid'
import ImageStack from '../components/ImageStack'
import { Link } from 'react-router-dom'

export default function Tips(){
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Hero with background image */}
      <section className="relative overflow-hidden rounded-2xl shadow">
        <img src="https://picsum.photos/id/1011/1600/600" alt="Lifestyle" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"/>
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">Manage your lifestyle</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base">Learn how to live the healthiest lifestyle for you—simple tips on diet, movement, sleep and emotional wellbeing.</p>
          <div className="mt-4 flex gap-2">
            <Link to="/pcos" className="bg-white/90 hover:bg-white text-gray-900 px-4 py-2 rounded shadow">Back to PCOS check</Link>
          </div>
        </div>
      </section>

      {/* Two-column intro: bullets + stacked images */}
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Simple, sustainable habits</h2>
          <ul className="list-disc ml-6 mt-3 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Colorful, fiber-rich meals for steady energy</li>
            <li>Gentle movement most days (walks, yoga, strength)</li>
            <li>Sleep rhythm and small stress breaks</li>
            <li>Track what works in your Dashboard</li>
          </ul>
        </div>
        <div className="relative justify-self-end w-[320px] md:w-[360px]">
          <ImageStack images={[
            'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=60', // period calendar/notes
            'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=900&q=60', // healthy bowl
            'https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?auto=format&fit=crop&w=900&q=60', // daily routine desk
          ]} />
        </div>
      </section>

      {/* Tips with 3D hover */}
      <div className="pt-2">
        <HealthTipsGrid />
      </div>

      {/* More reads */}
      <div className="border-t pt-6">
        <ResourceGrid title="More to explore" subtitle="Curated reads to go deeper into PCOS management, diagnosis and symptoms."/>
      </div>
    </div>
  )
}
