import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import { rateLimit } from 'express-rate-limit'
import path from 'node:path'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'

import healthRoutes from './routes/health.routes.js'
import authRoutes from './routes/auth.routes.js'
import nutritionRoutes from './routes/nutrition.routes.js'
import productRoutes from './routes/product.routes.js'
import orderRoutes from './routes/order.routes.js'
import adminRoutes from './routes/admin.routes.js'
import uploadRoutes from './routes/upload.routes.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

const trustProxyRaw = process.env.TRUST_PROXY
app.set('trust proxy', trustProxyRaw !== undefined ? Number(trustProxyRaw) : 1)

app.use(helmet())
app.use(compression())

const clientOrigin = process.env.CLIENT_ORIGIN || ''
if (clientOrigin) {
  app.use(
    cors({
      origin: clientOrigin.split(',').map((o) => o.trim()),
      credentials: true,
    })
  )
} else {
  app.use(cors())
}
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true }))

if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'))
}

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === 'GET' || req.method === 'OPTIONS',
  message: { success: false, error: 'محاولات كثيرة جداً، حاول مجدداً لاحقاً' },
})

const getLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method !== 'GET',
  message: { success: false, error: 'طلبات كثيرة جداً، حاول مجدداً لاحقاً' },
})

app.use('/api', apiLimiter)
app.use('/api/products', getLimiter)
app.use('/api/auth/me', getLimiter)
app.use('/api/health', healthRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/nutrition', nutritionRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/upload', uploadRoutes)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const clientDist = path.resolve(__dirname, '../../client/dist')
if (fs.existsSync(clientDist)) {
  app.use(
    express.static(clientDist, {
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache')
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
        }
      },
    })
  )
  app.get(/^\/(?!api\/).*/, (req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'))
  })
}

app.use(notFound)
app.use(errorHandler)

export default app
