import multer from 'multer'
import mongoose from 'mongoose'
import { ApiError } from '../utils/apiError.js'

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}

export function errorHandler(err, req, res, next) {
  if (err instanceof multer.MulterError) {
    const message = err.code === 'LIMIT_FILE_SIZE' ? 'File is too large (max 5MB)' : err.message
    return res.status(400).json({ success: false, error: message })
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ success: false, error: 'معرّف غير صالح' })
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)[0]?.message || 'بيانات غير صالحة'
    return res.status(422).json({ success: false, error: message })
  }

  const statusCode = err.statusCode || (err.isOperational ? 400 : 500)
  const message = statusCode === 500 ? 'Internal server error' : err.message

  if (statusCode === 500) console.error(err)

  res.status(statusCode).json({ success: false, error: message })
}
