import { Router } from 'express'
import { createOrder } from '../controllers/order.controller.js'
import { orderRules, validate } from '../middleware/validate.js'
import { optionalAuth } from '../middleware/auth.middleware.js'

const router = Router()

router.post('/', optionalAuth, orderRules, validate, createOrder)

export default router
