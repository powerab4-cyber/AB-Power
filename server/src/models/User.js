import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const GENDERS = ['ذكر', 'أنثى']
const ACTIVITY_LEVELS = ['خامل', 'خفيف النشاط', 'نشاط متوسط', 'نشاط عالي', 'نشاط شديد']
const GOALS = ['إنقاص الوزن', 'زيادة الوزن', 'بناء العضلات', 'الحفاظ على اللياقة', 'تثبيت الوزن']

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'الاسم الكامل مطلوب'],
      trim: true,
      minlength: [2, 'الاسم قصير جداً'],
      maxlength: [100, 'الاسم طويل جداً'],
    },
    email: {
      type: String,
      required: [true, 'البريد الإلكتروني مطلوب'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'بريد إلكتروني غير صالح'],
    },
    password: {
      type: String,
      required: [true, 'كلمة المرور مطلوبة'],
      minlength: [8, 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'],
      select: false,
    },
    role: {
      type: String,
      enum: ['admin', 'client'],
      default: 'client',
    },
    age: { type: Number, min: 10, max: 100, default: null },
    gender: { type: String, enum: GENDERS, default: null },
    height: { type: Number, min: 100, max: 250, default: null },
    weight: { type: Number, min: 30, max: 300, default: null },
    activity: { type: String, enum: ACTIVITY_LEVELS, default: null },
    goals: { type: [String], enum: GOALS, default: [] },
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const salt = await bcrypt.genSalt(12)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password)
}

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password
    delete ret.__v
    return ret
  },
})

const User = mongoose.model('User', userSchema)
export default User
