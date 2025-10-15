import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import cron from 'node-cron';

import authRoutes from './routes/auth.js';
import trackerRoutes from './routes/tracker.js';
import pcosRoutes from './routes/pcos.js';
import chatRoutes from './routes/chat.js';
import reminderRoutes from './routes/reminders.js';
import adminRoutes from './routes/admin.js';

import { scheduleReminders } from './utils/scheduler.js';
import { notFound, errorHandler } from './middleware/error.js';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hercycle';
const PORT = process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/tracker', trackerRoutes);
app.use('/api/pcos', pcosRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

cron.schedule('0 8 * * *', async () => {
  try {
    await scheduleReminders();
    console.log('Daily reminders scheduled at 8 AM');
  } catch (e) {
    console.error('Scheduler error:', e.message);
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
