import User from '../models/User.js';
import { predictNextPeriod, predictFertileWindow } from './predictor.js';

export const scheduleReminders = async () => {
  const users = await User.find({});
  const now = new Date();
  for (const user of users) {
    const next = predictNextPeriod(user.cycles);
    const fertile = predictFertileWindow(user.cycles);
    if (next) {
      const d = new Date(next.nextStart);
      const message = `Expected period around ${d.toDateString()}. Take care and keep supplies ready.`;
      // Add reminder 2 days before
      const remindDate = new Date(d);
      remindDate.setDate(d.getDate() - 2);
      if (remindDate > now) {
        user.reminders.push({ type: 'period', message, date: remindDate, sent: false });
      }
    }
    if (fertile) {
      const start = new Date(fertile.start);
      const message = `Fertile window starts ${start.toDateString()}.`;
      const remindDate = new Date(start);
      remindDate.setDate(start.getDate() - 1);
      if (remindDate > now) {
        user.reminders.push({ type: 'ovulation', message, date: remindDate, sent: false });
      }
    }
    await user.save();
  }
};
