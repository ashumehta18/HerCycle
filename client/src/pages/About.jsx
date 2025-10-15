import { Link } from 'react-router-dom'

export default function About(){
  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl shadow">
        <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1600&q=60" alt="Together" className="w-full h-64 md:h-80 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"/>
        <div className="absolute inset-0 p-6 md:p-10 flex flex-col justify-end text-white">
          <h1 className="text-3xl md:text-5xl font-extrabold drop-shadow">About HerCycle</h1>
          <p className="mt-2 max-w-2xl text-sm md:text-base">A kind, privacy-first space to understand your cycle, mood, and wellbeing—at your own pace.</p>
        </div>
      </section>

      {/* Mission */}
      <section className="grid md:grid-cols-2 gap-6 items-center">
        <div>
          <h2 className="text-2xl font-bold">Our mission</h2>
          <p className="mt-2 text-gray-700 dark:text-gray-300">We build simple, supportive tools that help you notice patterns, plan ahead, and feel more in tune with your body. Most features work locally first; sync when you’re ready.</p>
        </div>
        <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <ul className="list-disc ml-6 space-y-2 text-gray-700 dark:text-gray-300">
            <li>Friendly design with gentle language</li>
            <li>Local-first data with optional account sync</li>
            <li>Simple predictions and helpful reminders</li>
            <li>Optional AI guidance for general support</li>
          </ul>
        </div>
      </section>

      {/* Values */}
      <section>
        <h3 className="text-xl font-semibold">Our values</h3>
        <div className="mt-3 grid md:grid-cols-3 gap-4">
          <Value title="Kindness">We choose words that feel safe, warm, and respectful.</Value>
          <Value title="Clarity">We keep things simple and avoid overwhelming screens.</Value>
          <Value title="Control">You decide what to log, when to sync, and what to delete.</Value>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h4 className="font-semibold">Have feedback or ideas?</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300">We’d love to hear what would make HerCycle even better for you.</p>
        </div>
        <Link to="/chatbot" className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded shadow">Chat with us</Link>
      </section>
    </div>
  )
}

function Value({ title, children }){
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
      <h5 className="font-semibold">{title}</h5>
      <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{children}</p>
    </div>
  )
}
