import ImageKit from '@imagekit/nodejs'
import { ApiError } from '../utils/apiError.js'

let client = null

export function getImagekit() {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new ApiError(500, 'IMAGEKIT_PRIVATE_KEY is not set in .env')
  }
  if (!client) {
    client = new ImageKit({ privateKey: process.env.IMAGEKIT_PRIVATE_KEY })
  }
  return client
}
