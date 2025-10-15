import User from '../models/User.js';
import { predictNextPeriod, predictFertileWindow } from '../utils/predictor.js';

export const addCycle = async (req, res) => {
  const { startDate, endDate, flow, pain, mood, notes } = req.body;
  if (!startDate || !endDate) return res.status(400).json({ message: 'startDate and endDate required' });
  const user = await User.findById(req.user._id);
  user.cycles.push({ startDate, endDate, flow, pain, mood, notes });
  await user.save();
  const prediction = predictNextPeriod(user.cycles);
  const fertile = predictFertileWindow(user.cycles);
  res.status(201).json({ cycles: user.cycles, prediction, fertile });
};

export const getDashboard = async (req, res) => {
  const user = await User.findById(req.user._id);
  const prediction = predictNextPeriod(user.cycles);
  const fertile = predictFertileWindow(user.cycles);
  res.json({ cycles: user.cycles, prediction, fertile });
};
