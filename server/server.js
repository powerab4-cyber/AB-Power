import 'dotenv/config'
import app from './src/app.js'
import { connectDB } from './src/config/db.js'

const PORT = process.env.PORT || 5000

process.on('unhandledRejection', (reason) => {
  console.error('UNHANDLED REJECTION:', reason)
})

process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  process.exit(1)
})

let server
const shutdown = async (signal) => {
  console.log(`\n${signal} received, shutting down gracefully...`)
  if (server) {
    server.close(async () => {
      const { default: mongoose } = await import('mongoose')
      await mongoose.disconnect()
      console.log('Server closed. Goodbye.')
      process.exit(0)
    })
  } else {
    process.exit(0)
  }
}

process.on('SIGINT', () => shutdown('SIGINT'))
process.on('SIGTERM', () => shutdown('SIGTERM'))

connectDB()
  .then(() => {
    server = app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
