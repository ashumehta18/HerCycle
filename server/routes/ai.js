import express from 'express'
import { generateAiReportNarrative } from '../controllers/aiController.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// POST /api/ai/report -> returns narrative text based on posted data
router.post('/report', protect, generateAiReportNarrative)

export default router
