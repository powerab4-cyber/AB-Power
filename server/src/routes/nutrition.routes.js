import { Router } from 'express'
import { getNutrition } from '../controllers/nutrition.controller.js'
import { protect } from '../middleware/auth.middleware.js'

const router = Router()

router.get('/', protect, getNutrition)

export default router
