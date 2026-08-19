import { Router } from 'express'
import { rateLimit } from 'express-rate-limit'
import { signup, login, me, updateProfile, changePassword, createAdmin } from '../controllers/auth.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { signupRules, clientProfileRules, loginRules, updateProfileRules, changePasswordRules, validate } from '../middleware/validate.js'

const router = Router()

const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'محاولات كثيرة جداً، حاول مجدداً بعد 5 دقائق' },
})

router.post('/signup', authLimiter, signupRules, clientProfileRules, validate, signup)
router.post('/login', authLimiter, loginRules, validate, login)
router.get('/me', protect, me)
router.patch('/me', protect, updateProfileRules, validate, updateProfile)
router.post('/change-password', protect, changePasswordRules, validate, changePassword)
router.post('/admins', protect, adminOnly, signupRules, validate, createAdmin)

export default router
