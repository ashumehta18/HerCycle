import HeroCarousel from '../components/HeroCarousel'
import FeatureCards from '../components/FeatureCards'
import QuickStartTracker from '../components/QuickStartTracker'

export default function Home(){
  return (
    <main className="max-w-7xl mx-auto p-4 md:p-6">
      <HeroCarousel />

      <section className="mt-8 md:mt-10">
        <h2 className="text-2xl font-bold">Explore HerCycle</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">Smart period and wellness tools designed to be kind and simple.</p>
        <div className="mt-4">
          <FeatureCards />
        </div>
      </section>

      <section className="mt-10 grid md:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg">Why track?</h3>
          <p className="mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
            Keeping track of your period can help you understand more about your cycle and overall health. It can also help you plan so you can always be prepared.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
          <h3 className="font-semibold text-lg">Your data, your device</h3>
          <p className="mt-2 text-sm md:text-base text-gray-700 dark:text-gray-300">
            Most dashboard features work locally first. Sign in to sync when you’re ready.
          </p>
        </div>
      </section>

      <QuickStartTracker />
    </main>
  )
}
