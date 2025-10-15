// Simple scoring model for demo. Not medical advice.
export const analyzePCOS = async (req, res) => {
  const { cycleIrregularity, acne, hirsutism, weightGain, insulinResistance, familyHistory } = req.body;
  let score = 0;
  const add = (cond, val) => (cond ? (score += val) : score);
  add(cycleIrregularity, 2);
  add(acne, 1);
  add(hirsutism, 2);
  add(weightGain, 1);
  add(insulinResistance, 2);
  add(familyHistory, 1);
  const risk = score >= 6 ? 'High' : score >= 3 ? 'Moderate' : 'Low';
  res.json({ score, risk });
};
