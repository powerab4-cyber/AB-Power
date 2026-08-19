import { useMemo, useState } from 'react'
import { useAuth } from '../../auth/context'
import { changePassword, getToken, updateProfile } from '../../lib/api'
import { UserIcon } from './icons'

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function strengthOf(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++
  if (/\d/.test(pw)) score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  return Math.min(score, 4)
}

const strengthLabels = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً']
const strengthColors = ['bg-red-500', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400', 'bg-emerald-500']

function Field({
  label,
  hint,
  ...input
}: { label: string; hint?: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-white">{label}</span>
      <input
        {...input}
        className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white placeholder:text-mist/50 backdrop-blur transition-colors focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-purple/60"
      />
      {hint && <span className="mt-1 block text-xs text-mist">{hint}</span>}
    </label>
  )
}

export function ProfilePage() {
  const { user, updateUser } = useAuth()

  const [name, setName] = useState(user?.fullName ?? '')
  const [email, setEmail] = useState(user?.email ?? '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [infoSaving, setInfoSaving] = useState(false)
  const [passSaving, setPassSaving] = useState(false)
  const [passOpen, setPassOpen] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const strength = useMemo(() => strengthOf(newPassword), [newPassword])
  const initials = useMemo(
    () =>
      (user?.fullName ?? '')
        .trim()
        .split(/\s+/)
        .map((word) => word.charAt(0))
        .slice(0, 2)
        .join(''),
    [user?.fullName]
  )

  const infoDirty = name.trim() !== (user?.fullName ?? '') || email.trim() !== (user?.email ?? '')

  const saveInfo = async () => {
    const token = getToken()
    if (!token) return
    setMessage(null)
    setInfoSaving(true)
    try {
      const res = await updateProfile(token, { fullName: name.trim(), email: email.trim() })
      updateUser(res.user)
      setMessage({ type: 'success', text: 'تم حفظ المعلومات الشخصية' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'حدث خطأ أثناء الحفظ' })
    } finally {
      setInfoSaving(false)
    }
  }

  const savePassword = async () => {
    const token = getToken()
    if (!token) return
    setMessage(null)
    if (!currentPassword) {
      setMessage({ type: 'error', text: 'كلمة المرور الحالية مطلوبة' })
      return
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'كلمتا المرور غير متطابقتين' })
      return
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' })
      return
    }
    setPassSaving(true)
    try {
      await changePassword(token, { currentPassword, newPassword, confirm: confirmPassword })
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPassOpen(false)
      setMessage({ type: 'success', text: 'تم تغيير كلمة المرور بنجاح' })
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'حدث خطأ أثناء التغيير' })
    } finally {
      setPassSaving(false)
    }
  }

  if (!user) return null

  return (
    <section className="animate-fade-up">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">الملف الشخصي</h1>
        <p className="mt-1.5 text-sm text-mist">إدارة معلومات حسابك وكلمة المرور</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-5">
        <aside className="lg:col-span-2">
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="relative border-b border-white/10 bg-gradient-to-l from-violet/15 to-purple/15 px-6 py-8 text-center">
              <div
                className="pointer-events-none absolute -end-8 -top-10 h-32 w-32 rounded-full bg-violet/10 blur-3xl"
                aria-hidden="true"
              />
              <div className="relative mx-auto h-24 w-24 rounded-full bg-gradient-to-l from-violet to-purple p-[3px] shadow-lg shadow-violet/30">
                <span className="flex h-full w-full items-center justify-center rounded-full bg-night font-display text-3xl font-bold text-white">
                  {initials || 'م'}
                </span>
              </div>
              <h2 className="mt-4 truncate font-display text-xl font-bold">{user.fullName}</h2>
              <p dir="ltr" className="mt-1 truncate text-sm text-mist">
                {user.email}
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet/10 px-3 py-1 text-xs font-bold text-soft">
                <UserIcon />
                {user.role === 'admin' ? 'مشرف' : 'عميل'}
              </span>
            </div>
          </div>
        </aside>

        <div className="space-y-6 lg:col-span-3">
          {message && (
            <div
              className={`rounded-2xl border px-4 py-3 text-center text-sm font-semibold ${
                message.type === 'success'
                  ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                  : 'border-red-400/30 bg-red-400/10 text-red-300'
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="font-display text-lg font-bold">المعلومات الشخصية</h3>
            <p className="mt-1 text-xs text-mist">الاسم والبريد المستخدمان في حساب المشرف</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="الاسم الكامل" value={name} onChange={(e) => setName(e.target.value)} />
              <Field label="البريد الإلكتروني" type="email" dir="ltr" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            {infoDirty && (
              <div className="mt-5 flex justify-end">
                <button
                  type="button"
                  disabled={infoSaving || !name.trim() || !email.trim()}
                  onClick={saveInfo}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {infoSaving ? <Spinner /> : null}
                  حفظ المعلومات
                </button>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <h3 className="font-display text-lg font-bold">كلمة المرور</h3>
            <p className="mt-1 text-xs text-mist">اختر كلمة مرور قوية لحماية حسابك</p>

            {!passOpen ? (
              <div className="mt-5">
                <button
                  type="button"
                  onClick={() => setPassOpen(true)}
                  className="rounded-full border border-violet/40 bg-violet/10 px-6 py-2.5 text-sm font-bold text-soft transition-colors hover:bg-violet/20"
                >
                  تغيير كلمة المرور
                </button>
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="كلمة المرور الحالية"
                    type="password"
                    dir="ltr"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  <Field
                    label="كلمة المرور الجديدة"
                    type="password"
                    dir="ltr"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <Field
                  label="تأكيد كلمة المرور"
                  type="password"
                  dir="ltr"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {newPassword && (
                  <div className="rounded-2xl bg-white/[0.03] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-xs font-bold text-mist">قوة كلمة المرور</span>
                      <span className={`text-xs font-bold ${strength >= 3 ? 'text-emerald-300' : 'text-amber-300'}`}>
                        {strengthLabels[strength]}
                      </span>
                    </div>
                    <div className="mt-2 flex gap-1.5" dir="ltr">
                      {[0, 1, 2, 3].map((i) => (
                        <span
                          key={i}
                          className={`h-1.5 flex-1 rounded-full transition-colors ${
                            i < strength ? strengthColors[strength] : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPassOpen(false)
                      setCurrentPassword('')
                      setNewPassword('')
                      setConfirmPassword('')
                    }}
                    className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-bold text-mist transition-colors hover:text-white"
                  >
                    إلغاء
                  </button>
                  <button
                    type="button"
                    disabled={passSaving || !currentPassword || !newPassword || !confirmPassword}
                    onClick={savePassword}
                    className="flex items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {passSaving ? <Spinner /> : null}
                    حفظ كلمة المرور
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
