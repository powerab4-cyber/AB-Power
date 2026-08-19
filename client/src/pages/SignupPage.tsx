import { useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Field, PasswordField, ChipGroup, SubmitButton, ErrorNote } from '../components/auth/fields'
import { useAuth } from '../auth/context'

const steps = [
  { id: 1, title: 'الحساب' },
  { id: 2, title: 'الشخصية' },
  { id: 3, title: 'الجسم' },
  { id: 4, title: 'الأهداف' },
]

const genders = ['ذكر', 'أنثى']
const activityLevels = ['خامل', 'خفيف النشاط', 'نشاط متوسط', 'نشاط عالي', 'نشاط شديد']
const goalOptions = [
  'إنقاص الوزن',
  'زيادة الوزن',
  'بناء العضلات',
  'الحفاظ على اللياقة',
  'تثبيت الوزن',
]

type FormState = {
  fullName: string
  email: string
  password: string
  confirm: string
  age: string
  gender: string
  height: string
  weight: string
  activity: string
  goals: string[]
}

type Errors = Partial<Record<string, string>>

const initialForm: FormState = {
  fullName: '',
  email: '',
  password: '',
  confirm: '',
  age: '',
  gender: '',
  height: '',
  weight: '',
  activity: '',
  goals: [],
}

function validateStep(step: number, form: FormState): Errors {
  const errors: Errors = {}
  if (step === 0) {
    if (!form.fullName.trim()) errors.fullName = 'الاسم الكامل مطلوب'
    if (!form.email.trim()) errors.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errors.email = 'أدخل بريداً إلكترونياً صحيحاً'
    if (form.password.length < 8) errors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    if (!form.confirm) errors.confirm = 'أعد كتابة كلمة المرور'
    else if (form.confirm !== form.password) errors.confirm = 'كلمتا المرور غير متطابقتين'
  }
  if (step === 1) {
    const age = Number(form.age)
    if (!form.age) errors.age = 'العمر مطلوب'
    else if (Number.isNaN(age) || age < 10 || age > 100) errors.age = 'أدخل عمراً بين 10 و 100'
    if (!form.gender) errors.gender = 'اختر الجنس'
  }
  if (step === 2) {
    const height = Number(form.height)
    const weight = Number(form.weight)
    if (!form.height) errors.height = 'الطول مطلوب'
    else if (Number.isNaN(height) || height < 100 || height > 250) errors.height = 'أدخل طولاً بين 100 و 250 سم'
    if (!form.weight) errors.weight = 'الوزن مطلوب'
    else if (Number.isNaN(weight) || weight < 30 || weight > 300) errors.weight = 'أدخل وزناً بين 30 و 300 كغ'
    if (!form.activity) errors.activity = 'اختر مستوى النشاط'
  }
  if (step === 3 && form.goals.length === 0) {
    errors.goals = 'اختر هدفاً واحداً على الأقل'
  }
  return errors
}

function CheckMark() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function WizardProgress({ step }: { step: number }) {
  return (
    <div className="mb-5">
      <div className="flex items-center">
        {steps.map((s, i) => (
          <div key={s.id} className={`flex items-center ${i < steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center gap-2.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  i < step
                    ? 'bg-gradient-to-l from-violet to-purple text-white'
                    : i === step
                      ? 'border-2 border-violet/70 bg-violet/15 text-soft'
                      : 'border-2 border-white/10 text-mist/60'
                }`}
              >
                {i < step ? <CheckMark /> : s.id}
              </span>
              <span
                className={`hidden text-xs font-semibold sm:inline ${
                  i <= step ? 'text-white' : 'text-mist/50'
                }`}
              >
                {s.title}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="mx-2.5 h-px flex-1 bg-white/10">
                <div
                  className={`h-px bg-gradient-to-l from-violet to-purple transition-all duration-500 ${
                    i < step ? 'w-full' : 'w-0'
                  }`}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-gradient-to-l from-violet to-purple transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>
    </div>
  )
}

function StepButtons({
  step,
  loading,
  onBack,
}: {
  step: number
  loading: boolean
  onBack: () => void
}) {
  return (
    <div className="flex items-center gap-3">
      {step > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="rounded-full border border-white/10 bg-white/[0.04] px-6 py-3 font-display text-base font-bold text-mist transition-colors hover:border-violet/40 hover:text-white"
        >
          رجوع
        </button>
      )}
      <SubmitButton loading={loading}>
        {step === steps.length - 1 ? 'إنشاء الحساب' : 'التالي'}
      </SubmitButton>
    </div>
  )
}

export function SignupPage() {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')
  const { signup } = useAuth()
  const navigate = useNavigate()

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const handleNext = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateStep(step, form)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    if (step < steps.length - 1) {
      setStep((s) => s + 1)
      setErrors({})
      return
    }

    setLoading(true)
    setServerError('')
    try {
      await signup({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
        confirm: form.confirm,
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        activity: form.activity,
        goals: form.goals,
      })
      navigate('/')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  const stepContent: ReactNode[] = [
    <div key="account" className="space-y-4">
      <Field
        id="fullName"
        label="الاسم الكامل"
        value={form.fullName}
        onChange={(e) => set('fullName', e.target.value)}
        placeholder="مثال: محمد بن علي"
        autoComplete="name"
        error={errors.fullName}
      />
      <Field
        id="email"
        label="البريد الإلكتروني"
        type="email"
        value={form.email}
        onChange={(e) => set('email', e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        error={errors.email}
        dir="ltr"
        className="text-left"
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <PasswordField
          id="password"
          label="كلمة المرور"
          value={form.password}
          onChange={(e) => set('password', e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.password}
        />
        <PasswordField
          id="confirm"
          label="تأكيد كلمة المرور"
          value={form.confirm}
          onChange={(e) => set('confirm', e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
          error={errors.confirm}
        />
      </div>
    </div>,

    <div key="personal" className="space-y-4">
      <Field
        id="age"
        label="العمر"
        type="number"
        inputMode="numeric"
        value={form.age}
        onChange={(e) => set('age', e.target.value)}
        placeholder="مثال: 25"
        error={errors.age}
      />
      <ChipGroup
        id="gender"
        label="الجنس"
        options={genders}
        value={form.gender}
        onChange={(v) => set('gender', v as string)}
        error={errors.gender}
      />
    </div>,

    <div key="body" className="space-y-4">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          id="height"
          label="الطول (سم)"
          type="number"
          inputMode="numeric"
          value={form.height}
          onChange={(e) => set('height', e.target.value)}
          placeholder="مثال: 175"
          error={errors.height}
        />
        <Field
          id="weight"
          label="الوزن (كغ)"
          type="number"
          inputMode="numeric"
          value={form.weight}
          onChange={(e) => set('weight', e.target.value)}
          placeholder="مثال: 72"
          error={errors.weight}
        />
      </div>
      <ChipGroup
        id="activity"
        label="مستوى النشاط اليومي"
        options={activityLevels}
        value={form.activity}
        onChange={(v) => set('activity', v as string)}
        error={errors.activity}
      />
    </div>,

    <div key="goals" className="space-y-4">
      <ChipGroup
        id="goals"
        label="أهدافك"
        options={goalOptions}
        value={form.goals}
        onChange={(v) => set('goals', v as string[])}
        multiple
        error={errors.goals}
      />
      <p className="text-center text-xs text-mist/70">يمكنك اختيار أكثر من هدف</p>
    </div>,
  ]

  return (
    <AuthLayout
      title="ابدأ رحلتك الآن"
      subtitle="أربع خطوات تفصلك عن حسابك الجديد"
      wide
    >
      <WizardProgress step={step} />
      <form key={step} onSubmit={handleNext} noValidate className="animate-fade-up space-y-5">
        {stepContent[step]}
        {serverError && <ErrorNote>{serverError}</ErrorNote>}
        <StepButtons step={step} loading={loading} onBack={() => setStep((s) => s - 1)} />
        <p className="text-center text-sm text-mist">
          عندك حساب؟{' '}
          <Link to="/login" className="font-bold text-soft transition-colors hover:text-white">
            سجّل الدخول
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
