import { Router } from 'express'
import { listActiveProducts, getProductById } from '../controllers/product.controller.js'

const router = Router()

router.get('/', listActiveProducts)
router.get('/:id', getProductById)

export default router
