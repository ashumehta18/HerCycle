export default function PcosIntro(){
  return (
    <section className="mt-6 space-y-6">
      {/* Definition card */}
      <div className="rounded-2xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-6 shadow-sm">
        <h2 className="text-2xl font-extrabold">PCOS kya hota hai? / What is PCOS?</h2>
        <p className="mt-2 text-gray-700 dark:text-gray-300">
          Polycystic Ovary Syndrome (PCOS) ek common hormonal condition hai jo ovaries ko affect karti hai. Symptoms har person me alag ho sakte hain—
          jaise irregular periods, acne, hair growth (hirsutism), weight changes ya insulin resistance. This is information, not medical advice.
        </p>
      </div>

      {/* Fun tech-style quick facts */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-2">In short (dev vibes) 💻</h3>
          <pre className="text-xs md:text-sm bg-gray-50 dark:bg-gray-900 rounded p-3 overflow-auto"><code>{`const pcos = {
  common: true,
  symptoms: ['irregularPeriods', 'acne', 'hirsutism', 'weightChanges'],
  causes: ['insulinResistance', 'androgenImbalance', 'genetics'],
  variesByPerson: true,
  diagnosis: 'history + exam + labs',
  note: 'not medical advice',
};`}</code></pre>
        </div>

        <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
          <h3 className="font-semibold mb-2">Why it happens? (simple view) 🔍</h3>
          <ul className="list-disc ml-5 space-y-1 text-sm text-gray-700 dark:text-gray-300">
            <li><b>Insulin resistance</b>: sugar handling me challenge → hormones par effect.</li>
            <li><b>Androgen imbalance</b>: higher androgens acne/hair growth ko trigger kar sakte hain.</li>
            <li><b>Genetics</b>: family history matter kar sakti hai.</li>
            <li><b>Lifestyle modifiers</b>: sleep, stress, movement aur meals symptoms ko influence karte hain.</li>
          </ul>
        </div>
      </div>

      {/* Myth busters & friendly nudge */}
      <div className="grid md:grid-cols-3 gap-4">
        <InfoChip emoji="🌈" title="One size ≠ all">
          Har body different hai—PCOS experience personal hota hai. Progress &gt; perfection.
        </InfoChip>
        <InfoChip emoji="🥗" title="Small, steady steps">
          Fiber + protein, gentle movement, stress breaks—little habits add up.
        </InfoChip>
        <InfoChip emoji="🩺" title="Talk to a clinician">
          Concern ho to professional se baat karna best next step hai.
        </InfoChip>
      </div>
    </section>
  )
}

function InfoChip({ emoji, title, children }){
  return (
    <div className="rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 p-4">
      <div className="flex items-center gap-2">
        <span className="text-lg">{emoji}</span>
        <h4 className="font-semibold">{title}</h4>
      </div>
      <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">{children}</p>
    </div>
  )
}
