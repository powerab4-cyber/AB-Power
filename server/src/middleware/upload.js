import multer from 'multer'

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

function sniffImageType(buffer) {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return 'image/jpeg'
  }
  if (buffer.length >= 8 && buffer.subarray(0, 8).toString('latin1') === '\x89PNG\r\n\x1a\n') {
    return 'image/png'
  }
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('latin1') === 'RIFF' &&
    buffer.subarray(8, 12).toString('latin1') === 'WEBP'
  ) {
    return 'image/webp'
  }
  if (
    (buffer.length >= 6 && ['GIF87a', 'GIF89a'].includes(buffer.subarray(0, 6).toString('latin1')))
  ) {
    return 'image/gif'
  }
  return null
}

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME.has(file.mimetype)) {
      const err = new Error('Only image files (jpg, png, webp, gif) are allowed')
      err.statusCode = 400
      err.isOperational = true
      return cb(err)
    }
    cb(null, true)
  },
})

export function verifyImageMagic(req, res, next) {
  try {
    if (!req.file) return next()
    const detected = sniffImageType(req.file.buffer)
    if (!detected) {
      const err = new Error('File content does not match a supported image type')
      err.statusCode = 400
      err.isOperational = true
      return next(err)
    }
    if (detected !== req.file.mimetype) {
      req.file.mimetype = detected
    }
    next()
  } catch (err) {
    next(err)
  }
}
