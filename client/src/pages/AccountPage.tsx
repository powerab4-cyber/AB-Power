import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'
import { useAuth } from '../auth/context'
import { getNutrition, getToken, updateProfile } from '../lib/api'
import type { FoodSuggestion, NutritionPlan } from '../lib/api'
import { HomeIcon, LogoutIcon, SearchIcon } from './dashboard/icons'
import { LogoutDialog } from '../components/LogoutDialog'
import { ChipGroup, Field } from '../components/auth/fields'

const genders = ['ذكر', 'أنثى']
const activityLevels = ['خامل', 'خفيف النشاط', 'نشاط متوسط', 'نشاط عالي', 'نشاط شديد']
const goalOptions = [
  'إنقاص الوزن',
  'زيادة الوزن',
  'بناء العضلات',
  'الحفاظ على اللياقة',
  'تثبيت الوزن',
]

const GOAL_DESCRIPTIONS: Record<string, string> = {
  'إنقاص الوزن': 'سعرات مضبوطة وبروتين أعلى لتحافظ على كتلتك العضلية أثناء خسارة الدهون',
  'زيادة الوزن': 'سعرات زائدة وأطعمة كثيفة الطاقة لبناء مخزون صحي',
  'بناء العضلات': 'بروتين كافٍ مع سعرات داعمة لتعافي العضلات ونموها',
  'الحفاظ على اللياقة': 'توازن ثابت بين السعرات والمغذيات طوال اليوم',
  'تثبيت الوزن': 'توازن ثابت بين السعرات والمغذيات طوال اليوم',
}

type FormState = {
  fullName: string
  email: string
  age: string
  gender: string
  height: string
  weight: string
  activity: string
  goals: string[]
}

type Message = { type: 'success' | 'error'; text: string } | null

type Tab = 'plan' | 'profile'

function BaseIcon({ children, className = 'h-5 w-5' }: { children: ReactNode; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" />
    </BaseIcon>
  )
}

function BoltIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M13 2 3 14h9l-1 8 10-12h-9l1-8Z" />
    </BaseIcon>
  )
}

function GaugeIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="m12 14 4-4" />
      <path d="M3.34 19a10 10 0 1 1 17.32 0" />
    </BaseIcon>
  )
}

function DropIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M12 2.7s6 6.1 6 10.3a6 6 0 0 1-12 0c0-4.2 6-10.3 6-10.3Z" />
    </BaseIcon>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </BaseIcon>
  )
}

function RulerIcon({ className }: { className?: string }) {
  return (
    <BaseIcon className={className}>
      <rect x="2" y="9" width="20" height="6" rx="2" />
      <path d="M6 9v2M10 9v2M14 9v2M18 9v2" />
    </BaseIcon>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function CalorieDonut({ plan }: { plan: NutritionPlan }) {
  const proteinKcal = (plan.protein ?? 0) * 4
  const carbsKcal = (plan.carbs ?? 0) * 4
  const fatKcal = (plan.fat ?? 0) * 9
  const total = Math.max(proteinKcal + carbsKcal + fatKcal, 1)
  const radius = 60
  const circumference = 2 * Math.PI * radius
  const gap = 5
  const segments = [
    { value: proteinKcal, color: '#9347d1', delay: 0 },
    { value: carbsKcal, color: '#38bdf8', delay: 150 },
    { value: fatKcal, color: '#f59e0b', delay: 300 },
  ]

  let offset = 0

  return (
    <div className="relative shrink-0">
      <div
        className="pointer-events-none absolute inset-4 animate-pulse-glow rounded-full bg-violet/25 blur-2xl"
        aria-hidden="true"
      />
      <svg
        viewBox="0 0 160 160"
        className="relative h-36 w-36 animate-pop-in sm:h-44 sm:w-44 [filter:drop-shadow(0_10px_30px_rgba(147,71,209,0.35))]"
        role="img"
        aria-label="توزيع السعرات اليومية بين البروتين والكربوهيدرات والدهون"
      >
        <circle cx="80" cy="80" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="15" />
        {segments.map((segment, index) => {
          const fraction = segment.value / total
          const length = Math.max(fraction * circumference - gap, 1)
          const arc = (
            <circle
              key={index}
              cx="80"
              cy="80"
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth="15"
              strokeLinecap="round"
              className="donut-seg"
              style={{
                strokeDasharray: `${length} ${circumference - length}`,
                strokeDashoffset: -offset,
                animationDelay: `${segment.delay}ms`,
              }}
              transform="rotate(-90 80 80)"
            />
          )
          offset += fraction * circumference
          return arc
        })}
        <text
          x="80"
          y="76"
          textAnchor="middle"
          style={{ fontFamily: 'Changa, sans-serif' }}
          fontSize="27"
          fontWeight="800"
          fill="#ffffff"
        >
          {Math.round(plan.dailyCalories ?? 0)}
        </text>
        <text x="80" y="96" textAnchor="middle" fontSize="11" fill="#a9a3c2">
          سعرة / يوم
        </text>
      </svg>
    </div>
  )
}

function MacroCard({
  label,
  grams,
  kcal,
  total,
  dot,
  bar,
}: {
  label: string
  grams: number
  kcal: number
  total: number
  dot: string
  bar: string
}) {
  const pct = total > 0 ? Math.min((kcal / total) * 100, 100) : 0
  return (
    <div className="rounded-2xl border border-white/10 bg-night/40 p-4">
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold text-white">
          <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
          {label}
        </span>
        <span className="text-sm font-semibold text-soft">
          {grams} غ <span className="text-xs font-semibold text-mist">· {kcal} سعرة</span>
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10" dir="ltr">
        <div className={`grow-bar h-full rounded-full bg-gradient-to-l ${bar}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1.5 text-[11px] text-mist">{Math.round(pct)}% من سعراتك اليومية</p>
    </div>
  )
}

function BmiGauge({ value, category }: { value: number; category: string }) {
  const min = 15
  const max = 35
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100))

  const zones = [
    { label: 'نحافة', left: 15, right: 18.5, text: 'text-emerald-300', dot: 'bg-emerald-400' },
    { label: 'طبيعي', left: 18.5, right: 25, text: 'text-amber-200', dot: 'bg-amber-300' },
    { label: 'زيادة', left: 25, right: 30, text: 'text-orange-300', dot: 'bg-orange-400' },
    { label: 'سمنة', left: 30, right: 35, text: 'text-red-300', dot: 'bg-red-400' },
  ]
  const activeIndex = Math.max(
    0,
    zones.findIndex((z) => value >= z.left && value < z.right)
  )

  return (
    <div className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-mist">مؤشر كتلة الجسم (BMI)</p>
        <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-[11px] font-bold text-soft">
          {category}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="font-display text-4xl font-bold text-white">{value}</p>
        <p className="pb-1 text-[11px] text-mist">كغ/م²</p>
      </div>

      <div className="mt-6">
        <div
          dir="ltr"
          className="relative flex h-2.5 overflow-hidden rounded-full"
          style={{ background: 'linear-gradient(90deg,#34d399,#fbbf24 45%,#fb923c 68%,#f87171)' }}
        >
          {[18.5, 25, 30].map((tick) => (
            <span
              key={tick}
              className="absolute top-0 h-full w-px bg-night/70"
              style={{ left: `${((tick - min) / (max - min)) * 100}%` }}
            />
          ))}
          <div
            className="absolute top-1/2 h-5 w-1.5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.95)]"
            style={{ left: `${pct}%`, transition: 'left 1s cubic-bezier(0.22, 1, 0.36, 1)' }}
          />
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-mist" dir="ltr">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>35</span>
        </div>
      </div>

      <div className="mt-4 flex" dir="ltr">
        {zones.map((z, i) => {
          const width = ((z.right - z.left) / (max - min)) * 100
          return (
            <span
              key={z.label}
              className={`flex items-center justify-center gap-1 py-1.5 text-[10px] font-bold transition-colors ${
                i === activeIndex ? `${z.text} bg-white/[0.06]` : 'text-mist/60'
              } ${i === 0 ? 'rounded-s-lg' : ''} ${i === zones.length - 1 ? 'rounded-e-lg' : ''}`}
              style={{ width: `${width}%` }}
            >
              <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${z.dot}`} />
              <span className="truncate">{z.label}</span>
            </span>
          )
        })}
      </div>
    </div>
  )
}

function StatTile({
  icon,
  label,
  value,
  unit,
  tint = 'bg-violet/15 text-violet',
  glow = 'bg-violet/20',
  className = '',
}: {
  icon: ReactNode
  label: string
  value: string
  unit?: string
  tint?: string
  glow?: string
  className?: string
}) {
  return (
    <div className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-5 ${className}`}>
      <div
        className={`pointer-events-none absolute -end-8 -top-10 h-24 w-24 rounded-full blur-2xl ${glow}`}
        aria-hidden="true"
      />
      <div className="relative flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${tint}`}>{icon}</span>
        <p className="text-xs font-semibold text-mist">{label}</p>
      </div>
      <p className="relative mt-3 font-display text-2xl font-bold text-white">
        {value}
        {unit && <span className="ms-1 text-xs font-semibold text-mist">{unit}</span>}
      </p>
    </div>
  )
}

function MacroCell({ value, label, tone }: { value: number; label: string; tone: string }) {
  return (
    <div className="py-1">
      <p className={`text-base font-bold ${tone}`}>{value}</p>
      <p className="mt-0.5 text-[10px] text-mist">{label}</p>
    </div>
  )
}

function FoodCard({ food }: { food: FoodSuggestion }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-1 hover:border-white/25">
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate font-display text-base font-bold text-white">{food.name}</h3>
        <span className="shrink-0 text-[11px] font-semibold text-mist">{food.category}</span>
      </div>
      <div className="my-3 h-px bg-white/10" aria-hidden="true" />
      <div className="grid grid-cols-4 divide-x divide-white/10 text-center">
        <MacroCell value={food.per100g.cal} label="سعرة" tone="text-soft" />
        <MacroCell value={food.per100g.protein} label="بروتين" tone="text-soft" />
        <MacroCell value={food.per100g.carbs} label="كارب" tone="text-soft" />
        <MacroCell value={food.per100g.fat} label="دهون" tone="text-soft" />
      </div>
    </div>
  )
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && <p className="mb-1 text-[11px] font-bold tracking-wider text-violet">{eyebrow}</p>}
        <h2 className="font-display text-lg font-bold sm:text-xl">{title}</h2>
        {subtitle && <p className="mt-0.5 text-xs text-mist">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

function FormGroup({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: ReactNode
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-violet to-purple text-white shadow-md shadow-violet/30">
          {icon}
        </span>
        <div>
          <h3 className="font-display text-base font-bold">{title}</h3>
          {subtitle && <p className="mt-0.5 text-xs text-mist">{subtitle}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </section>
  )
}

export function AccountPage() {
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { user, logout, updateUser } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab] = useState<Tab>('plan')
  const [form, setForm] = useState<FormState>(() => ({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    age: user?.age != null ? String(user.age) : '',
    gender: user?.gender ?? '',
    height: user?.height != null ? String(user.height) : '',
    weight: user?.weight != null ? String(user.weight) : '',
    activity: user?.activity ?? '',
    goals: user?.goals ?? [],
  }))

  const [plan, setPlan] = useState<NutritionPlan | null>(null)
  const [foods, setFoods] = useState<FoodSuggestion[]>([])
  const [foodCategory, setFoodCategory] = useState('')
  const [foodSearch, setFoodSearch] = useState('')
  const [planLoading, setPlanLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<Message>(null)

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }))

  const loadNutrition = useCallback(() => {
    const token = getToken()
    if (!token) return
    setPlanLoading(true)
    getNutrition(token)
      .then((res) => {
        setPlan(res.plan)
        setFoods(res.foods)
      })
      .catch(() => setToast({ type: 'error', text: 'تعذّر تحميل خطتك الغذائية' }))
      .finally(() => setPlanLoading(false))
  }, [])

  useEffect(() => {
    loadNutrition()
  }, [loadNutrition])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 4000)
    return () => window.clearTimeout(timer)
  }, [toast])

  const switchTab = (next: Tab) => {
    setTab(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const filteredFoods = useMemo(() => {
    const q = foodSearch.trim().toLowerCase()
    return foods.filter(
      (food) =>
        (!foodCategory || food.category === foodCategory) &&
        (!q || food.name.toLowerCase().includes(q))
    )
  }, [foods, foodCategory, foodSearch])

  if (!user) return null

  const firstName = user.fullName.trim().split(' ')[0] || 'بك'
  const initials = form.fullName.trim().split(/\s+/).map((w) => w.charAt(0)).slice(0, 2).join('')

  const handleLogout = () => {
    setLogoutOpen(false)
    logout()
    navigate('/')
  }

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'الاسم الكامل مطلوب'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'أدخل بريداً إلكترونياً صحيحاً'
    if (!form.age) return 'العمر مطلوب'
    const age = Number(form.age)
    if (Number.isNaN(age) || age < 10 || age > 100) return 'أدخل عمراً بين 10 و 100'
    if (!form.gender) return 'اختر الجنس'
    if (!form.height) return 'الطول مطلوب'
    const height = Number(form.height)
    if (Number.isNaN(height) || height < 100 || height > 250) return 'أدخل طولاً بين 100 و 250 سم'
    if (!form.weight) return 'الوزن مطلوب'
    const weight = Number(form.weight)
    if (Number.isNaN(weight) || weight < 30 || weight > 300) return 'أدخل وزناً بين 30 و 300 كغ'
    if (!form.activity) return 'اختر مستوى النشاط'
    if (!form.goals.length) return 'اختر هدفاً واحداً على الأقل'
    return null
  }

  const handleSave = async (e: FormEvent) => {
    e.preventDefault()
    const invalid = validate()
    if (invalid) {
      setToast({ type: 'error', text: invalid })
      return
    }
    const token = getToken()
    if (!token) return

    setToast(null)
    setSaving(true)
    try {
      const res = await updateProfile(token, {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        age: Number(form.age),
        gender: form.gender,
        height: Number(form.height),
        weight: Number(form.weight),
        activity: form.activity,
        goals: form.goals,
      })
      updateUser(res.user)
      setToast({ type: 'success', text: 'تم حفظ بياناتك وإعادة حساب خطتك بنجاح' })
      setTab('plan')
      loadNutrition()
    } catch (err) {
      setToast({ type: 'error', text: err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ' })
    } finally {
      setSaving(false)
    }
  }

  const dailyCalories = plan?.dailyCalories ?? 0
  const proteinKcal = (plan?.protein ?? 0) * 4
  const carbsKcal = (plan?.carbs ?? 0) * 4
  const fatKcal = (plan?.fat ?? 0) * 9

  return (
    <div className="min-h-screen bg-night font-body text-white">
      <header className="fixed inset-x-0 top-0 z-50 h-14 border-b border-white/5 bg-night/80 backdrop-blur-md sm:h-16">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="AB Power" className="h-10 w-auto object-contain sm:h-11" />
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-bold text-mist transition-colors hover:border-violet/40 hover:text-white sm:px-4"
            >
              <HomeIcon />
              <span className="hidden sm:inline">رجوع للرئيسية</span>
            </Link>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-3 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/20 sm:px-4"
            >
              <LogoutIcon />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-4 py-8 pt-24 sm:px-6">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-96 overflow-hidden"
          aria-hidden="true"
        >
          <div className="animate-aurora absolute -top-24 start-[10%] h-80 w-80 rounded-full bg-violet/15 blur-3xl" />
          <div
            className="animate-aurora absolute -top-16 end-[6%] h-64 w-64 rounded-full bg-purple/10 blur-3xl"
            style={{ animationDelay: '3s' }}
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 -z-10 bg-grid opacity-60 [mask-image:radial-gradient(ellipse_at_top,black,transparent_75%)]"
          aria-hidden="true"
        />

        <div className="mb-5">
          <p className="mb-1 text-xs font-bold tracking-wide text-violet">لوحة AB Power</p>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            {tab === 'plan' ? 'لوحتك الغذائية' : 'بياناتك الشخصية'}
          </h1>
          <p className="mt-1 text-sm text-mist">مرحباً {firstName} — كل الأرقام تُحسب تلقائياً من بياناتك</p>
        </div>

        <div className="sticky top-14 z-30 -mx-4 mb-5 border-b border-white/10 bg-night/90 px-4 backdrop-blur-md sm:top-16 sm:mx-0 sm:mb-8 sm:px-0">
          <div className="mx-auto flex w-full max-w-sm sm:mx-0 sm:max-w-none sm:gap-6">
            <button
              type="button"
              onClick={() => switchTab('plan')}
              aria-pressed={tab === 'plan'}
              className={`relative flex-1 whitespace-nowrap px-2 py-3.5 text-center text-sm font-bold transition-colors sm:flex-none sm:px-1 ${
                tab === 'plan' ? 'text-white' : 'text-mist hover:text-soft'
              }`}
            >
              <span className="relative z-10">خطتك الغذائية</span>
              <span
                className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 rounded-full bg-gradient-to-l from-violet to-purple transition-all duration-300 ${
                  tab === 'plan' ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                }`}
                aria-hidden="true"
              />
            </button>
            <button
              type="button"
              onClick={() => switchTab('profile')}
              aria-pressed={tab === 'profile'}
              className={`relative flex-1 whitespace-nowrap px-2 py-3.5 text-center text-sm font-bold transition-colors sm:flex-none sm:px-1 ${
                tab === 'profile' ? 'text-white' : 'text-mist hover:text-soft'
              }`}
            >
              <span className="relative z-10">بياناتك</span>
              <span
                className={`absolute inset-x-0 bottom-0 mx-auto h-0.5 rounded-full bg-gradient-to-l from-violet to-purple transition-all duration-300 ${
                  tab === 'profile' ? 'w-3/4 opacity-100' : 'w-0 opacity-0'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        </div>

        {tab === 'plan' ? (
          planLoading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-28 rounded-3xl border border-white/10 bg-white/[0.04]" />
              <div className="h-72 rounded-3xl border border-white/10 bg-white/[0.04] sm:h-64" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-28 rounded-3xl border border-white/10 bg-white/[0.04]" />
                ))}
              </div>
            </div>
          ) : plan?.bmi != null ? (
            <div className="animate-fade-up space-y-6 sm:space-y-8">
              <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-l from-violet/15 to-purple/10 p-5 sm:p-7">
                <div
                  className="animate-pulse-glow pointer-events-none absolute -end-10 -top-12 h-40 w-40 rounded-full bg-violet/15 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative flex flex-wrap items-center gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/30">
                    <TargetIcon />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-soft">هدفك الأساسي</p>
                    <h2 className="mt-0.5 font-display text-xl font-bold">{plan.primaryGoal}</h2>
                    <p className="mt-0.5 text-sm text-mist">
                      {GOAL_DESCRIPTIONS[plan.primaryGoal ?? ''] ?? ''}
                    </p>
                  </div>
                  <div className="flex w-full flex-wrap gap-2 sm:ms-auto sm:w-auto">
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-soft">
                      BMI {plan.bmi}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/[0.05] px-3.5 py-1.5 text-xs font-bold text-soft">
                      {plan.dailyCalories} سعرة / يوم
                    </span>
                  </div>
                </div>
              </section>

              <section>
                <SectionHeader
                  eyebrow="ميزانية اليوم"
                  title="خطتك اليومية من السعرات والماكروز"
                  subtitle="مقسمة حسب هدفك وبياناتك الجسدية"
                />
                <div className="grid gap-4 lg:grid-cols-3">
                  <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-4 sm:p-7 lg:col-span-2">
                    <div
                      className="pointer-events-none absolute -start-8 -top-10 h-32 w-32 rounded-full bg-purple/10 blur-3xl"
                      aria-hidden="true"
                    />
                    <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
                      <CalorieDonut plan={plan} />
                      <div className="w-full space-y-4 sm:space-y-5">
                        <div>
                          <h3 className="font-display text-lg font-bold">توزيع السعرات اليومية</h3>
                          <p className="mt-0.5 text-xs text-mist">مقسمة حسب احتياج هدفك وبياناتك</p>
                        </div>
                        <MacroCard
                          label="بروتين"
                          grams={plan.protein ?? 0}
                          kcal={proteinKcal}
                          total={dailyCalories}
                          dot="bg-violet"
                          bar="from-violet to-purple"
                        />
                        <MacroCard
                          label="كربوهيدرات"
                          grams={plan.carbs ?? 0}
                          kcal={carbsKcal}
                          total={dailyCalories}
                          dot="bg-sky-400"
                          bar="from-sky-400 to-blue-500"
                        />
                        <MacroCard
                          label="دهون"
                          grams={plan.fat ?? 0}
                          kcal={fatKcal}
                          total={dailyCalories}
                          dot="bg-amber-400"
                          bar="from-amber-400 to-orange-500"
                        />
                      </div>
                    </div>
                  </div>
                  <BmiGauge value={plan.bmi} category={plan.bmiCategory ?? ''} />
                </div>
              </section>

              <section>
                <SectionHeader
                  eyebrow="مؤشراتك"
                  title="أرقام اليوم"
                  subtitle="محسوبة من معدل الأيض ومستوى نشاطك"
                />
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                  <StatTile
                    icon={<BoltIcon />}
                    label="معدل الأيض الأساسي (BMR)"
                    value={String(plan.bmr)}
                    unit="سعرة/يوم"
                  />
                  <StatTile
                    icon={<GaugeIcon />}
                    label="استهلاك الطاقة اليومي (TDEE)"
                    value={String(plan.tdee)}
                    unit="سعرة/يوم"
                    tint="bg-sky-400/15 text-sky-300"
                    glow="bg-sky-400/20"
                  />
                  <StatTile
                    icon={<DropIcon />}
                    label="الماء يومياً"
                    value={String(plan.water)}
                    unit="لتر"
                    tint="bg-sky-400/15 text-sky-300"
                    glow="bg-sky-400/20"
                    className="col-span-2 sm:col-span-1"
                  />
                </div>
              </section>

              <section>
                <SectionHeader
                  eyebrow="اقتراحات ذكية"
                  title="أطعمة مقترحة لهدفك"
                  subtitle="مختارة حسب أهدافك واحتياجاتك — القيم لكل 100 غ"
                  action={
                    <span className="rounded-full border border-violet/30 bg-violet/10 px-3 py-1 text-xs font-bold text-soft">
                      {foods.length} طعاماً
                    </span>
                  }
                />
                {foods.length ? (
                  <>
                    <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center">
                      <div className="relative lg:w-72 lg:shrink-0">
                        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist" />
                        <input
                          type="search"
                          value={foodSearch}
                          onChange={(e) => setFoodSearch(e.target.value)}
                          placeholder="ابحث عن طعام…"
                          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-5 pr-12 text-white placeholder:text-mist/50 backdrop-blur transition-colors focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-purple/60"
                        />
                      </div>
                      <div className="flex flex-nowrap gap-2 overflow-x-auto pb-1.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:pb-0">
                        <button
                          type="button"
                          onClick={() => setFoodCategory('')}
                          className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                            foodCategory === ''
                              ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/30'
                              : 'border border-white/10 bg-white/[0.04] text-mist hover:-translate-y-0.5 hover:border-violet/40 hover:text-white'
                          }`}
                        >
                          <span>الكل</span>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              foodCategory === '' ? 'bg-white/20' : 'bg-white/[0.06]'
                            }`}
                          >
                            {foods.length}
                          </span>
                        </button>
                        {Array.from(new Set(foods.map((f) => f.category))).map((cat) => (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setFoodCategory(cat)}
                            className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                              foodCategory === cat
                                ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/30'
                                : 'border border-white/10 bg-white/[0.04] text-mist hover:-translate-y-0.5 hover:border-violet/40 hover:text-white'
                            }`}
                          >
                            <span>{cat}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                foodCategory === cat ? 'bg-white/20' : 'bg-white/[0.06]'
                              }`}
                            >
                              {foods.filter((f) => f.category === cat).length}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="mb-3 flex items-center gap-3">
                      <span className="whitespace-nowrap text-xs font-bold text-soft">
                        كل الأطعمة ({filteredFoods.length})
                      </span>
                      <span className="h-px flex-1 bg-white/10" aria-hidden="true" />
                    </div>
                    {filteredFoods.length ? (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {filteredFoods.slice(0, foodCategory || foodSearch ? undefined : 25).map((food) => (
                          <FoodCard key={food.name} food={food} />
                        ))}
                      </div>
                    ) : (
                      <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-mist">
                        لا توجد أطعمة مطابقة لبحثك.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-6 text-center text-sm text-mist">
                    لا توجد أطعمة مقترحة حالياً.
                  </p>
                )}
              </section>
            </div>
          ) : (
            <section className="animate-fade-up relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] px-5 py-12 text-center sm:px-6 sm:py-14">
              <div
                className="pointer-events-none absolute -start-16 -top-16 h-48 w-48 rounded-full bg-violet/10 blur-3xl"
                aria-hidden="true"
              />
              <span className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-l from-violet to-purple text-white shadow-xl shadow-violet/30">
                <TargetIcon className="h-8 w-8" />
              </span>
              <h2 className="relative mt-6 font-display text-xl font-bold">خطتك جاهزة للانطلاق</h2>
              <p className="relative mx-auto mt-2 max-w-md text-sm leading-relaxed text-mist">
                أكمل بياناتك (العمر، الطول، الوزن، مستوى النشاط وأهدافك) لنحسب لك سعراتك اليومية،
                توزيع الماكروز، وأفضل 25 طعاماً يناسب هدفك.
              </p>
              <button
                type="button"
                onClick={() => switchTab('profile')}
                className="relative mt-7 w-full rounded-full bg-gradient-to-l from-violet to-purple px-8 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105 sm:w-auto"
              >
                أكمل بياناتك الآن
              </button>
            </section>
          )
        ) : (
          <div className="animate-fade-up space-y-4 sm:space-y-5">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-l from-violet/15 to-purple/10 p-5 sm:p-6">
              <div
                className="pointer-events-none absolute -end-8 -top-10 h-32 w-32 rounded-full bg-violet/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative flex flex-wrap items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple font-display text-lg font-bold text-white shadow-lg shadow-violet/30">
                  {initials || 'م'}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate font-display text-lg font-bold">{form.fullName}</h2>
                  <p dir="ltr" className="truncate text-right text-sm text-mist">
                    {form.email}
                  </p>
                </div>
                <span className="rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs font-bold text-soft">
                  {user.role === 'admin' ? 'حساب مدير' : 'حساب عميل'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSave} noValidate className="space-y-4 sm:space-y-5">
              <FormGroup
                icon={<UserIcon />}
                title="المعلومات الأساسية"
                subtitle="تُستخدم كأساس لجميع الحسابات"
              >
                <Field
                  id="fullName"
                  label="الاسم الكامل"
                  value={form.fullName}
                  onChange={(e) => set('fullName', e.target.value)}
                  autoComplete="name"
                />
                <Field
                  id="email"
                  label="البريد الإلكتروني"
                  type="email"
                  value={form.email}
                  onChange={(e) => set('email', e.target.value)}
                  autoComplete="email"
                  dir="ltr"
                  className="text-left"
                />
                <Field
                  id="age"
                  label="العمر"
                  type="number"
                  inputMode="numeric"
                  value={form.age}
                  onChange={(e) => set('age', e.target.value)}
                  placeholder="مثال: 25"
                />
                <div className="sm:pt-7">
                  <ChipGroup
                    id="gender"
                    label="الجنس"
                    options={genders}
                    value={form.gender}
                    onChange={(v) => set('gender', v as string)}
                  />
                </div>
              </FormGroup>

              <FormGroup
                icon={<RulerIcon />}
                title="القياسات الجسدية"
                subtitle="للحصول على سعرات وكميات دقيقة"
              >
                <Field
                  id="height"
                  label="الطول (سم)"
                  type="number"
                  inputMode="numeric"
                  value={form.height}
                  onChange={(e) => set('height', e.target.value)}
                  placeholder="مثال: 175"
                />
                <Field
                  id="weight"
                  label="الوزن (كغ)"
                  type="number"
                  inputMode="numeric"
                  value={form.weight}
                  onChange={(e) => set('weight', e.target.value)}
                  placeholder="مثال: 72"
                />
              </FormGroup>

              <FormGroup
                icon={<TargetIcon />}
                title="النشاط والأهداف"
                subtitle="تحدد شكل خطتك اليومية"
              >
                <div className="sm:col-span-2">
                  <ChipGroup
                    id="activity"
                    label="مستوى النشاط اليومي"
                    options={activityLevels}
                    value={form.activity}
                    onChange={(v) => set('activity', v as string)}
                  />
                </div>
                <div className="sm:col-span-2">
                  <ChipGroup
                    id="goals"
                    label="أهدافك"
                    options={goalOptions}
                    value={form.goals}
                    onChange={(v) => set('goals', v as string[])}
                    multiple
                  />
                </div>
              </FormGroup>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-8 py-3.5 font-display text-base font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {saving ? <Spinner /> : null}
                  حفظ وإعادة الحساب
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {toast && (
        <div
          role="status"
          className={`fixed inset-x-0 bottom-5 z-[60] mx-auto w-[calc(100%-2rem)] max-w-md animate-pop-in rounded-2xl border px-4 py-3 text-center text-sm font-bold shadow-2xl backdrop-blur-md ${
            toast.type === 'success'
              ? 'border-emerald-400/40 bg-emerald-950/90 text-emerald-300'
              : 'border-red-400/40 bg-red-950/90 text-red-300'
          }`}
        >
          {toast.text}
        </div>
      )}

      <LogoutDialog
        open={logoutOpen}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  )
}
