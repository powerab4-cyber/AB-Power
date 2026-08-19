import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { verifyToken } from '../utils/jwt.js'

export async function protect(req, res, next) {
  try {
    const header = req.headers.authorization
    if (!header || !header.startsWith('Bearer ')) {
      throw new ApiError(401, 'غير مصرح: يلزم تسجيل الدخول')
    }

    const token = header.split(' ')[1]
    let decoded
    try {
      decoded = verifyToken(token)
    } catch (err) {
      if (err instanceof jwt.TokenExpiredError) throw new ApiError(401, 'انتهت صلاحية الجلسة، سجّل الدخول مجدداً')
      throw new ApiError(401, 'رمز غير صالح')
    }

    const user = await User.findById(decoded.id).select('+password')
    if (!user) throw new ApiError(401, 'المستخدم غير موجود')

    req.user = user
    next()
  } catch (err) {
    next(err)
  }
}

export function adminOnly(req, res, next) {
  if (req.user.role !== 'admin') {
    return next(new ApiError(403, 'غير مصرح: هذه العملية للمشرفين فقط'))
  }
  next()
}

export async function optionalAuth(req, res, next) {
  try {
    const header = req.headers.authorization
    if (header && header.startsWith('Bearer ')) {
      const token = header.split(' ')[1]
      const decoded = verifyToken(token)
      const user = await User.findById(decoded.id)
      if (user) req.user = user
    }
    next()
  } catch {
    next()
  }
}
