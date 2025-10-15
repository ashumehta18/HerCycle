import express from 'express';
import { protect } from '../middleware/auth.js';
import { chat } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, chat);

export default router;
