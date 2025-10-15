import express from 'express';
import { protect } from '../middleware/auth.js';
import { addCycle, getDashboard } from '../controllers/trackerController.js';

const router = express.Router();

router.get('/dashboard', protect, getDashboard);
router.post('/cycles', protect, addCycle);

export default router;
