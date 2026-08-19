import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: [true, 'الاسم الكامل مطلوب'], trim: true, maxlength: 100 },
    phone: { type: String, required: [true, 'رقم الهاتف مطلوب'], trim: true, maxlength: 20 },
    wilaya: { type: String, required: [true, 'الولاية مطلوبة'], trim: true },
    commune: { type: String, required: [true, 'البلدية مطلوبة'], trim: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, min: 1, max: 99, default: 1 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    status: {
      type: String,
      enum: ['pending', 'confirmed'],
      default: 'pending',
    },
    archived: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const Order = mongoose.model('Order', orderSchema)
export default Order
