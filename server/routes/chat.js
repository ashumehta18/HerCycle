import express from 'express';
import { protect } from '../middleware/auth.js';
import { chat, chatStatus } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', protect, chat);
router.get('/status', chatStatus);

export default router;
