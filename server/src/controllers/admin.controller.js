import User from '../models/User.js'
import Product from '../models/Product.js'
import Order from '../models/Order.js'
import { ApiError } from '../utils/apiError.js'
import { getImagekit } from '../config/imagekit.js'
import { clearProductCache } from './product.controller.js'

async function deleteImagekitFile(url) {
  try {
    if (!url) return
    const parsed = new URL(url)
    if (!parsed.pathname.startsWith('/ab-power/')) return
    await getImagekit().files.delete(parsed.pathname)
  } catch {
    // ignore ImageKit errors so DB operations still succeed
  }
}

export async function getStats(req, res, next) {
  try {
    const [users, products, orders] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
    ])
    res.json({ success: true, stats: { users, products, orders } })
  } catch (err) {
    next(err)
  }
}

export async function listUsers(req, res, next) {
  try {
    const users = await User.find().sort({ createdAt: -1 }).select('-__v').lean()
    res.json({ success: true, users })
  } catch (err) {
    next(err)
  }
}

export async function deleteUser(req, res, next) {
  try {
    const user = await User.findById(req.params.id)
    if (!user) throw new ApiError(404, 'المستخدم غير موجود')
    if (String(user._id) === String(req.user._id)) {
      throw new ApiError(422, 'لا يمكنك حذف حسابك الحالي')
    }
    await user.deleteOne()
    res.json({ success: true, message: 'تم حذف المستخدم' })
  } catch (err) {
    next(err)
  }
}

function pickProductFields(body) {
  const out = {}
  for (const key of ['image', 'category', 'title', 'description', 'weight', 'price', 'active']) {
    if (body[key] !== undefined) out[key] = body[key]
  }
  if (out.price !== undefined) out.price = Number(out.price)
  return out
}

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find().sort({ createdAt: -1 }).select('-__v').lean()
    res.json({ success: true, products })
  } catch (err) {
    next(err)
  }
}

export async function getAdminProductById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).select('-__v').lean()
    if (!product) throw new ApiError(404, 'المنتج غير موجود')
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

export async function createProduct(req, res, next) {
  try {
    const data = pickProductFields(req.body)
    if (!data.image || !data.title || data.price === undefined || Number.isNaN(data.price)) {
      throw new ApiError(422, 'الصورة والعنوان والسعر مطلوبة')
    }
    const product = await Product.create(data)
    clearProductCache()
    res.status(201).json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

export async function updateProduct(req, res, next) {
  try {
    const data = pickProductFields(req.body)
    if (data.price !== undefined && Number.isNaN(data.price)) {
      throw new ApiError(422, 'السعر غير صالح')
    }
    const existing = await Product.findById(req.params.id)
    if (!existing) throw new ApiError(404, 'المنتج غير موجود')

    const product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })

    if (data.image && data.image !== existing.image) {
      await deleteImagekitFile(existing.image)
    }

    clearProductCache()
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    if (!product) throw new ApiError(404, 'المنتج غير موجود')
    await deleteImagekitFile(product.image)
    clearProductCache()
    res.json({ success: true, message: 'تم حذف المنتج' })
  } catch (err) {
    next(err)
  }
}
