import Product from '../models/Product.js'
import { ApiError } from '../utils/apiError.js'

const CACHE_TTL_MS = 60_000
const cache = new Map()

async function cached(key, load) {
  const hit = cache.get(key)
  if (hit && Date.now() - hit.at < CACHE_TTL_MS) return hit.value
  const value = await load()
  cache.set(key, { value, at: Date.now() })
  return value
}

function setCacheHeaders(res) {
  res.set('Cache-Control', 'no-store')
}

export async function listActiveProducts(req, res, next) {
  try {
    const products = await cached('listActiveProducts', () =>
      Product.find({ active: true }).sort({ createdAt: -1 }).select('-__v').lean().exec()
    )
    setCacheHeaders(res)
    res.json({ success: true, products })
  } catch (err) {
    next(err)
  }
}

export async function getProductById(req, res, next) {
  try {
    const product = await cached(`product:${req.params.id}`, () =>
      Product.findOne({ _id: req.params.id, active: true }).select('-__v').lean().exec()
    )
    if (!product) throw new ApiError(404, 'المنتج غير موجود')
    setCacheHeaders(res)
    res.json({ success: true, product })
  } catch (err) {
    next(err)
  }
}

export function clearProductCache() {
  cache.clear()
}
