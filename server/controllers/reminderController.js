import User from '../models/User.js';

export const listReminders = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.reminders || []);
};

export const addReminder = async (req, res) => {
  const { type, message, date } = req.body;
  const user = await User.findById(req.user._id);
  user.reminders.push({ type, message, date });
  await user.save();
  res.status(201).json(user.reminders);
};
