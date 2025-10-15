import express from 'express';
import { protect } from '../middleware/auth.js';
import { analyzePCOS } from '../controllers/pcosController.js';

const router = express.Router();

router.post('/analyze', protect, analyzePCOS);

export default router;
