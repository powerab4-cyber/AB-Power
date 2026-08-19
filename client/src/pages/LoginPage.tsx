import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthLayout } from '../components/auth/AuthLayout'
import { Field, PasswordField, SubmitButton, ErrorNote } from '../components/auth/fields'
import { useAuth } from '../auth/context'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const next: typeof errors = {}
    if (!email.trim()) next.email = 'البريد الإلكتروني مطلوب'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'أدخل بريداً إلكترونياً صحيحاً'
    if (!password) next.password = 'كلمة المرور مطلوبة'
    else if (password.length < 8) next.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    setServerError('')
    try {
      await login(email.trim(), password)
      navigate('/')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="مرحباً بعودتك" subtitle="سجّل دخولك لمتابعة رحلتك نحو جسم أكثر صحة">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <Field
          id="email"
          label="البريد الإلكتروني"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email}
        />
        <PasswordField
          id="password"
          label="كلمة المرور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password}
        />

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-mist">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 accent-violet"
            />
            تذكرني
          </label>
          <a
            href="#forgot"
            onClick={(e) => e.preventDefault()}
            className="text-sm font-semibold text-soft transition-colors hover:text-white"
          >
            نسيت كلمة المرور؟
          </a>
        </div>

        {serverError && <ErrorNote>{serverError}</ErrorNote>}

        <SubmitButton loading={loading}>تسجيل الدخول</SubmitButton>

        <div className="flex items-center gap-3 text-xs text-mist/60">
          <span className="h-px flex-1 bg-white/10" />
          أو
          <span className="h-px flex-1 bg-white/10" />
        </div>

        <p className="text-center text-sm text-mist">
          ما عندك حساب؟{' '}
          <Link to="/signup" className="font-bold text-soft transition-colors hover:text-white">
            أنشئ حسابك
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
