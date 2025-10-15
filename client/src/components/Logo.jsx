export default function Logo({ showText = true, size = 36, className = '', textClassName = '' }) {
  const strokeWidth = 3
  const r = (size - strokeWidth) / 2
  const offset = r * 0.55
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg width={size * 2} height={size} viewBox={`0 0 ${size * 2} ${size}`} aria-label="HerCycle logo">
        <defs>
          <linearGradient id="hc-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#d946ef" />
            <stop offset="100%" stopColor="#ec4899" />
          </linearGradient>
        </defs>
        <circle cx={r + (size - r)} cy={size/2} r={r} fill="none" stroke="url(#hc-grad)" strokeWidth={strokeWidth} />
        <circle cx={r + (size - r) - offset} cy={size/2} r={r} fill="none" stroke="url(#hc-grad)" strokeWidth={strokeWidth} opacity="0.9" />
      </svg>
      {showText && (
        <span className={`text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 ${textClassName}`}>
          HerCycle
        </span>
      )}
    </div>
  )
}
