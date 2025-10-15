import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    cycles: [
      {
        startDate: Date,
        endDate: Date,
        flow: { type: String, enum: ['light', 'medium', 'heavy'] },
        pain: { type: Number, min: 0, max: 10 },
        mood: String,
        notes: String,
      },
    ],
    reminders: [
      {
        type: { type: String, enum: ['period', 'ovulation', 'wellness'] },
        message: String,
        date: Date,
        sent: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
