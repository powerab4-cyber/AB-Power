import mongoose from 'mongoose'

const MAX_RETRIES = 5
const RETRY_DELAY_MS = 5000

export async function connectDB(retries = MAX_RETRIES) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        maxPoolSize: 10,
        minPoolSize: 2,
        serverSelectionTimeoutMS: 10_000,
        socketTimeoutMS: 30_000,
        family: 4,
      })
      console.log('MongoDB connected')
      return
    } catch (err) {
      console.error(`MongoDB connection attempt ${attempt}/${retries} failed: ${err.message}`)
      if (attempt < retries) {
        console.log(`Retrying in ${RETRY_DELAY_MS / 1000}s...`)
        await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
      }
    }
  }
  throw new Error('Failed to connect to MongoDB after all retries')
}
