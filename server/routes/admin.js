import express from 'express';
import { protect, adminOnly } from '../middleware/auth.js';
import { getTrends } from '../controllers/adminController.js';

const router = express.Router();

router.get('/trends', protect, adminOnly, getTrends);

export default router;
