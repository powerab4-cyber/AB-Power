import { Router } from 'express'
import mongoose from 'mongoose'

const router = Router()

router.get('/', (req, res) => {
  const dbState = ['disconnected', 'connected', 'connecting', 'disconnecting'][mongoose.connection.readyState]
  res.json({ status: 'ok', db: dbState, uptime: process.uptime(), timestamp: new Date().toISOString() })
})

export default router
