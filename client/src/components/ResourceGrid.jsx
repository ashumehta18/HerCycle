const defaultItems = [
  { title:'What is PCOS?', img:'https://picsum.photos/id/1012/640/420', emoji:'💡', snippet:'PCOS is common and manageable—tiny steps add up.' },
  { title:'What’s new in PCOS', img:'https://picsum.photos/id/1035/640/420', emoji:'✨', snippet:'Science keeps evolving—stay kind to yourself.' },
  { title:'How is PCOS diagnosed', img:'https://picsum.photos/id/1005/640/420', emoji:'🩺', snippet:'Diagnosis blends history, symptoms, and labs.' },
  { title:'Psychological wellbeing', img:'https://picsum.photos/id/1021/640/420', emoji:'🧠', snippet:'Mood matters—micro-moments of joy help.' },
  { title:'PCOS and insulin', img:'https://picsum.photos/id/1040/640/420', emoji:'🍚', snippet:'Fiber + protein = steadier energy.' },
  { title:'PCOS key messages', img:'https://picsum.photos/id/1059/640/420', emoji:'📌', snippet:'You’re not alone. Progress > perfection.' },
  { title:'Symptoms of PCOS', img:'https://picsum.photos/id/1016/640/420', emoji:'🌼', snippet:'Bodies differ—your experience is valid.' },
  { title:'What causes PCOS?', img:'https://picsum.photos/id/1037/640/420', emoji:'🔎', snippet:'It’s multifactorial—no single cause.' },
  { title:'AMH and PCOS', img:'https://picsum.photos/id/1060/640/420', emoji:'🧪', snippet:'Labs are guides, not definitions.' },
]

export default function ResourceGrid({ items = defaultItems, title='Causes, diagnosis and symptoms', subtitle='Friendly cards with tiny tips—no deep articles required.' }){
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
        <p className="text-gray-600 dark:text-gray-300 mt-1">{subtitle}</p>
      </div>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
        {items.map((it, i)=> (
          <article key={i} className="rounded-xl overflow-hidden border bg-white dark:bg-gray-800 dark:border-gray-700 shadow-sm hover:shadow transition-shadow">
            <div>
              <div className="h-40 md:h-44 overflow-hidden">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{it.title}</h3>
                <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-base">{it.emoji || '💡'}</span>
                  <span>{it.snippet || 'A tiny tip to brighten your day.'}</span>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
