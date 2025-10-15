import express from 'express';
import { protect } from '../middleware/auth.js';
import { listReminders, addReminder } from '../controllers/reminderController.js';

const router = express.Router();

router.get('/', protect, listReminders);
router.post('/', protect, addReminder);

export default router;
