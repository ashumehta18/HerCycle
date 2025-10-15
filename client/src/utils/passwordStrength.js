export function getPasswordStrength(pw = '') {
  let level = 0
  if (pw.length >= 8) level++
  if (/[A-Z]/.test(pw)) level++
  if (/[a-z]/.test(pw)) level++
  if (/[0-9]/.test(pw)) level++
  if (/[^A-Za-z0-9]/.test(pw)) level++
  // normalize to 1..5 (0 if empty)
  if (!pw) level = 0
  if (level > 5) level = 5
  return { level, suggestions: suggestionsFor(pw, level) }
}

function suggestionsFor(pw, level) {
  if (!pw) return ['Use at least 8 characters with upper, lower, number and symbol.']
  const tips = []
  if (pw.length < 8) tips.push('Use 8+ characters.')
  if (!/[A-Z]/.test(pw)) tips.push('Add an uppercase letter (A-Z).')
  if (!/[a-z]/.test(pw)) tips.push('Add a lowercase letter (a-z).')
  if (!/[0-9]/.test(pw)) tips.push('Add a number (0-9).')
  if (!/[^A-Za-z0-9]/.test(pw)) tips.push('Add a symbol (!@#$, etc).')
  if (tips.length === 0 && level < 5) tips.push('Great! One more variety for maximum strength.')
  return tips
}
