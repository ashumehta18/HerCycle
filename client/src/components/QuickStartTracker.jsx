import { useMemo, useRef, useState } from 'react'

function addDays(date, days){
  const d = new Date(date)
  d.setDate(d.getDate()+days)
  return d
}

function fmt(d){
  return d.toISOString().split('T')[0]
}

function monthRange(fromDate){
  // Return 3 months starting from fromDate's month
  const start = new Date(fromDate.getFullYear(), fromDate.getMonth(), 1)
  const months = [start]
  months.push(new Date(start.getFullYear(), start.getMonth()+1, 1))
  months.push(new Date(start.getFullYear(), start.getMonth()+2, 1))
  return months
}

function getMonthMatrix(year, month){
  // month is 0-based
  const first = new Date(year, month, 1)
  const last = new Date(year, month+1, 0)
  const matrix = []
  let week = []

  // pad beginning
  for(let i=0;i<first.getDay();i++) week.push(null)

  for(let day=1; day<=last.getDate(); day++){
    week.push(new Date(year, month, day))
    if(week.length===7){ matrix.push(week); week=[] }
  }
  if(week.length){
    while(week.length<7) week.push(null)
    matrix.push(week)
  }
  return { matrix, first, last }
}

function buildPredictions({ lastStart, periodLen, cycleLen, viewStart, viewEnd }){
  // Generate sets for day categories within [viewStart, viewEnd]
  const period = new Set()
  const pre = new Set()
  const post = new Set()
  const ovu = new Set()

  // loop cycles forward/backward to cover window
  // start baseline close to viewStart
  let cursor = new Date(lastStart)
  // go backwards until before viewStart - cycleLen
  while(addDays(cursor, -cycleLen) >= viewStart){
    cursor = addDays(cursor, -cycleLen)
  }

  while(cursor <= viewEnd){
    const start = new Date(cursor)
    const end = addDays(start, Math.max(1, periodLen)-1)
    // mark pre (2 days before start)
    for(let i=-2;i<0;i++){
      const d = addDays(start, i)
      if(d>=viewStart && d<=viewEnd) pre.add(fmt(d))
    }
    // mark period
    for(let i=0;i<periodLen;i++){
      const d = addDays(start, i)
      if(d>=viewStart && d<=viewEnd) period.add(fmt(d))
    }
    // mark post (2 days after end)
    for(let i=1;i<=2;i++){
      const d = addDays(end, i)
      if(d>=viewStart && d<=viewEnd) post.add(fmt(d))
    }
    // ovulation rough: start + (cycleLen - 14)
    const o = addDays(start, Math.max(1, cycleLen-14))
    ;[ -1, 0, 1 ].forEach(off=>{
      const d = addDays(o, off)
      if(d>=viewStart && d<=viewEnd) ovu.add(fmt(d))
    })

    cursor = addDays(cursor, cycleLen)
  }

  return { period, pre, post, ovu }
}

function makeICS(periodStarts){
  const NL='\r\n'
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//HerCycle//QuickStart//EN',
  ]
  periodStarts.forEach(d=>{
    const dt = new Date(d)
    const start = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 9, 0, 0))
    const end = new Date(Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate(), 10, 0, 0))
    const fmtICS = x=> x.toISOString().replace(/[-:]/g,'').split('.')[0]+'Z'
    lines.push('BEGIN:VEVENT')
    lines.push('UID:'+fmt(start)+Math.random().toString(36).slice(2)+'@hercycle')
    lines.push('DTSTAMP:'+fmtICS(new Date()))
    lines.push('DTSTART:'+fmtICS(start))
    lines.push('DTEND:'+fmtICS(end))
    lines.push('SUMMARY:Period start (predicted)')
    lines.push('END:VEVENT')
  })
  lines.push('END:VCALENDAR')
  const blob = new Blob([lines.join(NL)], { type:'text/calendar' })
  return URL.createObjectURL(blob)
}

export default function QuickStartTracker(){
  const today = new Date()
  // hydrate from localStorage lazily
  const [lastDate, setLastDate] = useState(()=>{
    const s = typeof window!== 'undefined' ? localStorage.getItem('qs_lastDate') : null
    const d = s ? new Date(s) : new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return isNaN(d.getTime()) ? new Date(today.getFullYear(), today.getMonth(), today.getDate()) : d
  })
  const [periodLen, setPeriodLen] = useState(()=>{
    const s = typeof window!== 'undefined' ? Number(localStorage.getItem('qs_periodLen')) : NaN
    return Number.isFinite(s) && s>=1 && s<=14 ? s : 5
  })
  const [cycleLen, setCycleLen] = useState(()=>{
    const s = typeof window!== 'undefined' ? Number(localStorage.getItem('qs_cycleLen')) : NaN
    return Number.isFinite(s) && s>=21 && s<=45 ? s : 28
  })
  const calRef = useRef(null)

  // persist on change
  useMemo(()=>{
    try{
      localStorage.setItem('qs_lastDate', fmt(lastDate))
      localStorage.setItem('qs_periodLen', String(periodLen))
      localStorage.setItem('qs_cycleLen', String(cycleLen))
    }catch{}
    return null
  }, [lastDate, periodLen, cycleLen])

  const { months, monthData, predictions, icsHref } = useMemo(()=>{
    const months = monthRange(lastDate)
    const monthData = months.map(m=>{
      const { matrix, first, last } = getMonthMatrix(m.getFullYear(), m.getMonth())
      return { matrix, first, last }
    })
    const viewStart = monthData[0].first
    const viewEnd = monthData[monthData.length-1].last
    const preds = buildPredictions({ lastStart:lastDate, periodLen, cycleLen, viewStart, viewEnd })

    // collect period start days within view for ICS
    const starts = []
    let cursor = new Date(lastDate)
    while(cursor <= viewEnd){
      if(cursor>=viewStart) starts.push(new Date(cursor))
      cursor = addDays(cursor, cycleLen)
    }
    const icsHref = makeICS(starts)
    return { months, monthData, predictions: preds, icsHref }
  }, [lastDate, periodLen, cycleLen])

  const onPrint = ()=> {
    if(!calRef.current){ window.print(); return }
    // Basic print of whole page keeps it simple for now
    window.print()
  }

  const DayCell = ({ date })=>{
    if(!date) return <div className="h-8 md:h-10" />
    const key = fmt(date)
    let badge = null
    // precedence: period > ovu > pre > post
    if(predictions.period.has(key)) badge = 'bg-rose-500'
    else if(predictions.ovu.has(key)) badge = 'bg-green-500'
    else if(predictions.pre.has(key)) badge = 'bg-amber-400'
    else if(predictions.post.has(key)) badge = 'bg-violet-400'

    return (
      <div className="h-8 md:h-10 flex items-center justify-center">
        <div className={`relative w-7 h-7 flex items-center justify-center text-xs rounded-full ${badge? 'text-white '+badge : 'text-gray-700 dark:text-gray-200'}`}>
          {date.getDate()}
        </div>
      </div>
    )
  }

  return (
    <section className="mt-10">
      <h2 className="text-center text-2xl md:text-3xl font-extrabold text-primary-600">Answer 3 quick questions and preview your tracker</h2>

      <div className="mt-4 grid md:grid-cols-3 gap-3">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Date of your last period?</p>
          <input type="date" className="mt-2 w-full rounded border p-2"
            value={fmt(lastDate)}
            onChange={(e)=> setLastDate(new Date(e.target.value))} />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">How long did it last?</p>
          <div className="mt-2 flex items-center gap-2">
            <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> setPeriodLen(Math.max(1, periodLen-1))}>-</button>
            <input type="number" min={1} max={14} className="w-full rounded border p-2 text-center" value={periodLen}
              onChange={(e)=> setPeriodLen(Math.max(1, Math.min(14, Number(e.target.value)||1)))} />
            <span>days</span>
            <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> setPeriodLen(Math.min(14, periodLen+1))}>+</button>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow">
          <p className="text-sm text-gray-600 dark:text-gray-300">Usual cycle length?</p>
          <div className="mt-2 flex items-center gap-2">
            <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> setCycleLen(Math.max(21, cycleLen-1))}>-</button>
            <input type="number" min={21} max={45} className="w-full rounded border p-2 text-center" value={cycleLen}
              onChange={(e)=> setCycleLen(Math.max(21, Math.min(45, Number(e.target.value)||28)))} />
            <span>days</span>
            <button className="px-2 py-1 rounded bg-gray-100" onClick={()=> setCycleLen(Math.min(45, cycleLen+1))}>+</button>
          </div>
        </div>
      </div>

      <div className="text-center mt-3">
        <button className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded shadow">Track Now</button>
      </div>

      <div ref={calRef} className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow p-4">
        <div className="grid md:grid-cols-3 gap-4">
          {months.map((m, idx)=>{
            const { matrix } = monthData[idx]
            const title = m.toLocaleString(undefined, { month:'long', year:'numeric' })
            return (
              <div key={idx}>
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold">{title}</h3>
                </div>
                <div className="grid grid-cols-7 text-xs text-gray-500 mb-1">
                  {['S','M','T','W','T','F','S'].map(d=> <div className="text-center py-1" key={d}>{d}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-y-1">
                  {matrix.flat().map((d,i)=> <DayCell key={i} date={d} />)}
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Legend color="bg-amber-400" label="Pre-Period" />
          <Legend color="bg-rose-500" label="Period Days" />
          <Legend color="bg-violet-400" label="Post Period" />
          <Legend color="bg-green-500" label="Peak Ovulation" />
        </div>

        <p className="mt-2 text-xs text-gray-500">Note: This tracker is an estimation and may vary from your unique cycle.</p>

        <div className="mt-4 flex flex-wrap gap-3">
          <button onClick={onPrint} className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Print</button>
          <a href={icsHref} download="hercycle-predicted.ics" className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200">Add to Calendar (.ics)</a>
        </div>
      </div>
    </section>
  )
}

function Legend({ color, label }){
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`inline-block w-3 h-3 rounded-full ${color}`}></span>
      {label}
    </span>
  )
}
