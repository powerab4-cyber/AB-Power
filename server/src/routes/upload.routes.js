import { Router } from 'express'
import { toFile } from '@imagekit/nodejs'
import { getImagekit } from '../config/imagekit.js'
import { upload, verifyImageMagic } from '../middleware/upload.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { ApiError } from '../utils/apiError.js'

const router = Router()

router.post('/', protect, adminOnly, upload.single('image'), verifyImageMagic, async (req, res, next) => {
  try {
    if (!req.file) throw new ApiError(400, 'No file uploaded — field name must be "image"')

    const safeName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_')

    const file = await toFile(req.file.buffer, safeName, {
      type: req.file.mimetype,
    })

    const result = await getImagekit().files.upload({
      file,
      fileName: `${Date.now()}-${safeName}`,
      folder: '/ab-power',
      useUniqueFileName: true,
    })

    res.status(201).json({ success: true, url: result.url, fileId: result.fileId, filePath: result.filePath })
  } catch (err) {
    next(err)
  }
})

export default router
