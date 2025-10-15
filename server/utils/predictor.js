// Simple heuristic predictor: average cycle length and period length
export const predictNextPeriod = (cycles = []) => {
  if (!cycles.length) return null;
  const sorted = [...cycles].sort((a, b) => new Date(a.startDate) - new Date(b.startDate));
  let total = 0;
  let count = 0;
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1].startDate);
    const curr = new Date(sorted[i].startDate);
    const diff = (curr - prev) / (1000 * 60 * 60 * 24);
    if (diff > 10 && diff < 60) {
      total += diff;
      count++;
    }
  }
  const avgCycle = count ? Math.round(total / count) : 28;
  const lastStart = new Date(sorted[sorted.length - 1].startDate);
  const nextStart = new Date(lastStart);
  nextStart.setDate(lastStart.getDate() + avgCycle);
  return { nextStart: nextStart.toISOString(), avgCycle };
};

export const predictFertileWindow = (cycles = []) => {
  const pred = predictNextPeriod(cycles);
  if (!pred) return null;
  const nextStart = new Date(pred.nextStart);
  const ovulation = new Date(nextStart);
  ovulation.setDate(ovulation.getDate() - 14);
  const start = new Date(ovulation);
  start.setDate(start.getDate() - 3);
  const end = new Date(ovulation);
  end.setDate(end.getDate() + 1);
  return { start: start.toISOString(), ovulation: ovulation.toISOString(), end: end.toISOString() };
};
