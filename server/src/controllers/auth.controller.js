import User from '../models/User.js'
import { ApiError } from '../utils/apiError.js'
import { signToken } from '../utils/jwt.js'

function pickClientFields(body) {
  const out = {}
  for (const key of ['fullName', 'email', 'password', 'age', 'gender', 'height', 'weight', 'activity', 'goals']) {
    if (body[key] !== undefined) out[key] = body[key]
  }
  return out
}

async function handleDuplicateEmail(err) {
  if (err.code === 11000) throw new ApiError(409, 'هذا البريد الإلكتروني مستخدم بالفعل')
  throw err
}

function sendAuthResponse(res, user, statusCode = 200) {
  const token = signToken(user)
  res.status(statusCode).json({ success: true, token, user })
}

export async function signup(req, res, next) {
  try {
    const data = pickClientFields(req.body)
    data.role = 'client'

    const user = await User.create(data).catch(handleDuplicateEmail)
    sendAuthResponse(res, user, 201)
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body

    const user = await User.findOne({ email }).select('+password')
    const ok = user && (await user.comparePassword(password))

    if (!ok) throw new ApiError(401, 'البريد الإلكتروني أو كلمة المرور غير صحيحة')

    sendAuthResponse(res, user)
  } catch (err) {
    next(err)
  }
}

export async function me(req, res) {
  res.json({ success: true, user: req.user })
}

export async function updateProfile(req, res, next) {
  try {
    const updates = {}
    for (const key of ['fullName', 'email', 'age', 'gender', 'height', 'weight', 'activity', 'goals']) {
      if (req.body[key] !== undefined) updates[key] = req.body[key]
    }

    if (updates.email && updates.email !== req.user.email) {
      const exists = await User.findOne({ email: updates.email })
      if (exists && String(exists._id) !== String(req.user._id)) {
        throw new ApiError(409, 'هذا البريد الإلكتروني مستخدم بالفعل')
      }
    }

    Object.assign(req.user, updates)
    await req.user.save()

    res.json({ success: true, user: req.user })
  } catch (err) {
    next(err)
  }
}

export async function changePassword(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body

    const ok = await req.user.comparePassword(currentPassword)
    if (!ok) throw new ApiError(401, 'كلمة المرور الحالية غير صحيحة')

    req.user.password = newPassword
    await req.user.save()

    res.json({ success: true, message: 'تم تغيير كلمة المرور بنجاح' })
  } catch (err) {
    next(err)
  }
}

export async function createAdmin(req, res, next) {
  try {
    const user = await User.create({ ...pickClientFields(req.body), role: 'admin' }).catch(handleDuplicateEmail)
    res.status(201).json({ success: true, user })
  } catch (err) {
    next(err)
  }
}
