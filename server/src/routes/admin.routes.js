import { Router } from 'express'
import {
  getStats,
  listUsers,
  deleteUser,
  listProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/admin.controller.js'
import { listOrders, confirmOrder, deleteOrder } from '../controllers/order.controller.js'
import { protect, adminOnly } from '../middleware/auth.middleware.js'
import { productRules, updateProductRules, validate } from '../middleware/validate.js'

const router = Router()

router.use(protect, adminOnly)

router.get('/stats', getStats)

router.get('/users', listUsers)
router.delete('/users/:id', deleteUser)

router.get('/products', listProducts)
router.get('/products/:id', getAdminProductById)
router.post('/products', productRules, validate, createProduct)
router.patch('/products/:id', updateProductRules, validate, updateProduct)
router.delete('/products/:id', deleteProduct)

router.get('/orders', listOrders)
router.patch('/orders/:id/confirm', confirmOrder)
router.delete('/orders/:id', deleteOrder)

export default router
