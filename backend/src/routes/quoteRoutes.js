import { Router } from 'express'
import { createQuote } from '../controllers/quoteController.js'
const router = Router()
router.post('/quotes', createQuote)
export default router
