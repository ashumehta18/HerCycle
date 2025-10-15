// Heuristic (client-side) AI-like reporter that turns local data into insights
// Inputs come from Dashboard localStorage keys and QuickStartTracker

function parseJSON(value, fallback){
  try { return JSON.parse(value ?? '') ?? fallback } catch { return fallback }
}

export function loadUserData() {
  const user = parseJSON(localStorage.getItem('user'), null)
  const moodHistory = parseJSON(localStorage.getItem('moodHistory'), []) // [{date, mood(1-5)}]
  const symptomHistory = parseJSON(localStorage.getItem('symptomHistory'), []) // [{date, symptom, intensity}]
  const dailyLogs = parseJSON(localStorage.getItem('dailyLogs'), {}) // {date: {pain:number, flow:number}}
  const qs = {
    lastDate: localStorage.getItem('qs_lastDate') || null,
    periodLen: Number(localStorage.getItem('qs_periodLen') || 5),
    cycleLen: Number(localStorage.getItem('qs_cycleLen') || 28)
  }
  return { user, moodHistory, symptomHistory, dailyLogs, qs }
}

function dateKey(d){ return typeof d === 'string' ? d : new Date(d).toISOString().slice(0,10) }

function avg(nums){ return nums.length ? nums.reduce((a,b)=>a+b,0)/nums.length : 0 }

function calcCycleMetrics(qs){
  const cycleLen = isFinite(qs.cycleLen) && qs.cycleLen>0 ? qs.cycleLen : 28
  const periodLen = isFinite(qs.periodLen) && qs.periodLen>0 ? qs.periodLen : 5
  // A simple variability heuristic based on recent changes the user may have made in tracker
  // If we had historical cycles we could compute SD; for now we surface the chosen config.
  return { cycleLen, periodLen, regularity: cycleLen>=26 && cycleLen<=32 ? 'likely regular' : 'may be irregular' }
}

function summarizeSymptoms(symptomHistory){
  const counts = {}
  symptomHistory.forEach(s => {
    const key = s.symptom || 'other'
    counts[key] = (counts[key]||0) + 1
  })
  const top = Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,3)
  return { counts, top }
}

function summarizePainFlow(dailyLogs){
  const entries = Object.entries(dailyLogs)
  const pains = entries.map(([d, v]) => v?.pain ?? 0)
  const flows = entries.map(([d, v]) => v?.flow ?? 0)
  return {
    avgPain: +avg(pains).toFixed(2),
    avgFlow: +avg(flows).toFixed(2),
    peakPainDates: entries.filter(([d,v])=> (v?.pain??0) >= 4).map(([d])=>d),
    heavyFlowDates: entries.filter(([d,v])=> (v?.flow??0) >= 2).map(([d])=>d)
  }
}

function summarizeMood(moodHistory){
  const vals = moodHistory.map(m=>m.mood ?? 0)
  const swing = (Math.max(0,...vals) - Math.min(5,...vals))
  return { avgMood: +avg(vals).toFixed(2), moodSwing: swing }
}

function pcosHeuristic(symptomHistory, dailyLogs){
  // Lightweight signal: frequent irregularity symptoms + higher pain/flow may increase risk flag
  const flags = ['irregular cycles','acne','hair growth','weight changes']
  const symptomCount = symptomHistory.filter(s=> flags.includes((s.symptom||'').toLowerCase())).length
  const { avgPain, avgFlow } = summarizePainFlow(dailyLogs)
  let score = 0
  if (symptomCount>=3) score += 2
  else if (symptomCount>=1) score += 1
  if (avgPain>=3) score += 1
  if (avgFlow>=2) score += 1
  const level = score>=3 ? 'elevated' : score>=2 ? 'borderline' : 'low'
  return { level, score }
}

export function generateAiReport(data){
  const { user, moodHistory, symptomHistory, dailyLogs, qs } = data
  const cycle = calcCycleMetrics(qs)
  const symptoms = summarizeSymptoms(symptomHistory)
  const painFlow = summarizePainFlow(dailyLogs)
  const mood = summarizeMood(moodHistory)
  const pcos = pcosHeuristic(symptomHistory, dailyLogs)

  const title = `Wellness Summary${user?.name ? ` for ${user.name}`: ''}`
  const overview = [
    `Cycle length set to ${cycle.cycleLen}d; period length ~${cycle.periodLen}d (${cycle.regularity}).`,
    `Average pain ${painFlow.avgPain}/5, average flow ${painFlow.avgFlow}/3.`,
    `Average mood ${mood.avgMood}/5 with swing ~${mood.moodSwing}.`,
  ]

  const topSymptoms = symptoms.top.map(([k,v])=> `${k} (${v})`)
  const insights = [
    topSymptoms.length ? `Most frequent symptoms: ${topSymptoms.join(', ')}.` : 'No symptoms logged frequently yet—great time to start tracking.',
    painFlow.peakPainDates.length ? `High pain days: ${painFlow.peakPainDates.join(', ')}.` : 'No high pain days detected recently.',
    painFlow.heavyFlowDates.length ? `Heavier flow days: ${painFlow.heavyFlowDates.join(', ')}.` : 'Flow has stayed light-to-moderate.',
  ]

  const recommendations = []
  if (painFlow.avgPain>=3) recommendations.push('Consider heat therapy, hydration, and gentle movement on high-pain days.')
  if (painFlow.avgFlow>=2) recommendations.push('Track iron-rich meals on heavier flow weeks (leafy greens, legumes).')
  if (mood.moodSwing>=3) recommendations.push('Add mood notes to spot patterns around ovulation and luteal phases.')
  if (!symptoms.top.length) recommendations.push('Log symptoms regularly to unlock deeper, personalized insights.')
  if (pcos.level==='elevated') recommendations.push('Your pattern suggests elevated PCOS risk—consider a clinical check-up for confirmation.')

  return {
    title,
    overview,
    sections: [
      { heading: 'Cycle', items: [cycle.regularity, `Cycle: ${cycle.cycleLen} days`, `Period: ${cycle.periodLen} days`] },
      { heading: 'Symptoms', items: insights },
      { heading: 'Mood', items: [`Average mood: ${mood.avgMood}/5`, `Mood swing: ${mood.moodSwing}`] },
      { heading: 'Risk signals', items: [`PCOS signal: ${pcos.level} (score ${pcos.score})`] },
    ],
    recommendations
  }
}

export function formatReportText(report){
  const lines = [ `# ${report.title}`, '', 'Overview:', ...report.overview.map(v=>`- ${v}`), '' ]
  report.sections.forEach(sec=>{ lines.push(`## ${sec.heading}`); sec.items.forEach(i=>lines.push(`- ${i}`)); lines.push('') })
  if (report.recommendations.length){ lines.push('Recommendations:'); report.recommendations.forEach(r=>lines.push(`- ${r}`)) }
  return lines.join('\n')
}
