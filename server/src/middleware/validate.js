import { check, validationResult } from 'express-validator'
import { ApiError } from '../utils/apiError.js'

export const signupRules = [
  check('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('الاسم الكامل مطلوب (حرفان على الأقل)'),
  check('email').trim().isEmail().withMessage('أدخل بريداً إلكترونياً صحيحاً').normalizeEmail(),
  check('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل'),
  check('confirm')
    .optional({ values: 'falsy' })
    .custom((value, { req }) => {
      if (value !== req.body.password) throw new Error('كلمتا المرور غير متطابقتين')
      return true
    }),
]

export const clientProfileRules = [
  check('age').optional({ nullable: true }).isInt({ min: 10, max: 100 }).withMessage('أدخل عمراً بين 10 و 100'),
  check('gender').optional({ nullable: true }).isIn(['ذكر', 'أنثى']).withMessage('الجنس غير صالح'),
  check('height').optional({ nullable: true }).isFloat({ min: 100, max: 250 }).withMessage('أدخل طولاً بين 100 و 250 سم'),
  check('weight').optional({ nullable: true }).isFloat({ min: 30, max: 300 }).withMessage('أدخل وزناً بين 30 و 300 كغ'),
  check('activity')
    .optional({ nullable: true })
    .isIn(['خامل', 'خفيف النشاط', 'نشاط متوسط', 'نشاط عالي', 'نشاط شديد'])
    .withMessage('مستوى النشاط غير صالح'),
  check('goals')
    .optional({ nullable: true })
    .isArray({ max: 10 }).withMessage('الأهداف غير صالحة')
    .custom((goals) => {
      const allowed = ['إنقاص الوزن', 'زيادة الوزن', 'بناء العضلات', 'الحفاظ على اللياقة', 'تثبيت الوزن']
      if (goals.some((g) => !allowed.includes(g))) throw new Error('هدف غير صالح')
      return true
    }),
]

export const loginRules = [
  check('email').trim().isEmail().withMessage('أدخل بريداً إلكترونياً صحيحاً').normalizeEmail(),
  check('password').notEmpty().withMessage('كلمة المرور مطلوبة'),
]

export const updateProfileRules = [
  check('fullName').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 100 }).withMessage('الاسم الكامل مطلوب (حرفان على الأقل)'),
  check('email').optional({ values: 'falsy' }).trim().isEmail().withMessage('أدخل بريداً إلكترونياً صحيحاً').normalizeEmail(),
  ...clientProfileRules,
]

export const changePasswordRules = [
  check('currentPassword').notEmpty().withMessage('كلمة المرور الحالية مطلوبة'),
  check('newPassword').isLength({ min: 8 }).withMessage('كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل'),
  check('confirm')
    .optional({ values: 'falsy' })
    .custom((value, { req }) => {
      if (value !== req.body.newPassword) throw new Error('كلمتا المرور غير متطابقتين')
      return true
    }),
]

export function validate(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new ApiError(422, errors.array()[0].msg))
  }
  next()
}

export const orderRules = [
  check('fullName').trim().isLength({ min: 2, max: 100 }).withMessage('الاسم الكامل مطلوب (حرفان على الأقل)'),
  check('phone')
    .trim()
    .isLength({ min: 9, max: 20 })
    .withMessage('أدخل رقم هاتف صحيحاً')
    .matches(/^[0-9+\s-]+$/).withMessage('أدخل رقم هاتف صحيحاً'),
  check('wilaya').trim().notEmpty().withMessage('اختر الولاية'),
  check('commune').trim().notEmpty().withMessage('أدخل البلدية'),
  check('product').isMongoId().withMessage('المنتج غير صالح'),
  check('quantity').optional({ values: 'falsy' }).isInt({ min: 1, max: 99 }).withMessage('الكمية غير صالحة'),
]

export const productRules = [
  check('image').trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('صورة المنتج غير صالحة'),
  check('category').trim().notEmpty().withMessage('التصنيف مطلوب'),
  check('title').trim().isLength({ min: 2, max: 200 }).withMessage('عنوان المنتج مطلوب'),
  check('description').trim().isLength({ min: 3, max: 500 }).withMessage('وصف المنتج مطلوب'),
  check('weight').trim().notEmpty().withMessage('وزن المنتج مطلوب'),
  check('price').isFloat({ min: 0 }).withMessage('أدخل سعراً صحيحاً'),
]

export const updateProductRules = [
  check('image').optional({ values: 'falsy' }).trim().isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('صورة المنتج غير صالحة'),
  check('category').optional({ values: 'falsy' }).trim().notEmpty().withMessage('التصنيف غير صالح'),
  check('title').optional({ values: 'falsy' }).trim().isLength({ min: 2, max: 200 }).withMessage('عنوان المنتج غير صالح'),
  check('description').optional({ values: 'falsy' }).trim().isLength({ min: 3, max: 500 }).withMessage('وصف المنتج غير صالح'),
  check('weight').optional({ values: 'falsy' }).trim().notEmpty().withMessage('الوزن غير صالح'),
  check('price').optional({ values: 'falsy' }).isFloat({ min: 0 }).withMessage('أدخل سعراً صحيحاً'),
]
