import User from '../models/User.js';

export const getTrends = async (req, res) => {
  const users = await User.find({}, { cycles: 1 });
  let totalCycles = 0;
  let cycleLenSum = 0, cycleLenCount = 0;
  let periodLenSum = 0, periodLenCount = 0;
  const flowCounts = { light: 0, medium: 0, heavy: 0 };

  users.forEach((u) => {
    const cycles = u.cycles || [];
    totalCycles += cycles.length;
    // period length per cycle
    cycles.forEach((cy) => {
      if (cy.startDate && cy.endDate) {
        const len = (new Date(cy.endDate) - new Date(cy.startDate)) / (1000 * 60 * 60 * 24);
        if (len > 0 && len < 15) { periodLenSum += len; periodLenCount++; }
      }
      if (cy.flow && flowCounts[cy.flow] !== undefined) flowCounts[cy.flow]++;
    });
    // cycle length between starts
    for (let i = 1; i < cycles.length; i++) {
      const prev = new Date(cycles[i - 1].startDate);
      const curr = new Date(cycles[i].startDate);
      const diff = (curr - prev) / (1000 * 60 * 60 * 24);
      if (diff > 10 && diff < 60) { cycleLenSum += diff; cycleLenCount++; }
    }
  });

  const avgCycleLength = cycleLenCount ? +(cycleLenSum / cycleLenCount).toFixed(1) : null;
  const avgPeriodLength = periodLenCount ? +(periodLenSum / periodLenCount).toFixed(1) : null;

  return res.json({
    totalUsers: users.length,
    totalCycles,
    avgCycleLength,
    avgPeriodLength,
    flowDistribution: flowCounts,
    samples: cycleLenCount,
  });
};
