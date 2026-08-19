import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { ApiError } from '../utils/apiError.js'

export async function createOrder(req, res, next) {
  try {
    const { fullName, phone, wilaya, commune, product: productId } = req.body
    let { quantity = 1 } = req.body
    quantity = Math.min(99, Math.max(1, Math.round(Number(quantity) || 1)))

    const product = await Product.findById(productId).lean()
    if (!product || !product.active) throw new ApiError(404, 'المنتج غير موجود')

    const order = await Order.create({
      fullName,
      phone,
      wilaya,
      commune,
      product: productId,
      quantity,
      user: req.user?._id ?? null,
    })

    res.status(201).json({ success: true, order })
  } catch (err) {
    next(err)
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('product')
      .select('-__v')
      .lean()
    res.json({ success: true, orders })
  } catch (err) {
    next(err)
  }
}

export async function confirmOrder(req, res, next) {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) throw new ApiError(404, 'الطلب غير موجود')
    if (order.status !== 'pending') throw new ApiError(422, 'الطلب ليس في حالة انتظار')

    order.status = 'confirmed'
    await order.save()

    const populated = await Order.findById(order._id).populate('product')
    res.json({ success: true, order: populated })
  } catch (err) {
    next(err)
  }
}

export async function deleteOrder(req, res, next) {
  try {
    const order = await Order.findByIdAndDelete(req.params.id)
    if (!order) throw new ApiError(404, 'الطلب غير موجود')
    res.json({ success: true, message: 'تم حذف الطلب من قاعدة البيانات' })
  } catch (err) {
    next(err)
  }
}
