import mongoose from 'mongoose'

const productSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    category: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 500 },
    weight: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
)

productSchema.index({ active: 1, createdAt: -1 })

const Product = mongoose.model('Product', productSchema)
export default Product
