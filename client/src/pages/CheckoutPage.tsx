import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getProduct, createOrder } from '../lib/api'
import type { Product } from '../lib/api'
import { formatPrice } from '../lib/format'
import { Field, ErrorNote } from '../components/auth/fields'

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function BackArrow() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-10 w-10"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export function CheckoutPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [wilaya, setWilaya] = useState('')
  const [commune, setCommune] = useState('')
  const [quantity, setQuantity] = useState(1)

  const [fieldError, setFieldError] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!productId) return
    let active = true
    getProduct(productId)
      .then((res) => {
        if (active) setProduct(res.product)
      })
      .catch((err) => {
        if (active) setLoadError(err instanceof Error ? err.message : 'المنتج غير موجود')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [productId])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [done])

  const validate = () => {
    if (!fullName.trim()) return 'الاسم الكامل مطلوب'
    if (fullName.trim().length < 2) return 'الاسم قصير جداً'
    if (phone.trim().length < 9) return 'أدخل رقم هاتف صحيحاً'
    if (!wilaya) return 'اختر الولاية'
    if (!commune.trim()) return 'أدخل البلدية'
    return ''
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!product) return
    const v = validate()
    if (v) {
      setFieldError(v)
      return
    }
    setSaving(true)
    setError('')
    setFieldError('')
    try {
      await createOrder({
        fullName: fullName.trim(),
        phone: phone.trim(),
        wilaya,
        commune: commune.trim(),
        product: product._id,
        quantity,
      })
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setSaving(false)
    }
  }

  const total = product ? product.price * quantity : 0

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night font-body text-white">
        <div className="flex flex-col items-center gap-3 text-mist">
          <Spinner />
          <span className="text-sm">جارٍ تحميل المنتج…</span>
        </div>
      </div>
    )
  }

  if (loadError || !product) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-night font-body text-white px-4">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <h1 className="font-display text-xl font-bold text-white">المنتج غير متاح</h1>
          <p className="mt-2 text-sm text-mist">{loadError || 'تعذّر العثور على المنتج'}</p>
          <Link
            to="/store"
            className="mt-6 inline-block rounded-full bg-gradient-to-l from-violet to-purple px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105"
          >
            العودة للمتجر
          </Link>
        </div>
      </div>
    )
  }

  if (done) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-night font-body text-white">
        <div className="pointer-events-none absolute -end-24 -top-24 h-80 w-80 rounded-full bg-violet/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-24 -start-24 h-80 w-80 rounded-full bg-purple/15 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-12 text-center">
          <span className="animate-pop-in flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-l from-emerald-500 to-emerald-400 text-white shadow-2xl shadow-emerald-500/30">
            <CheckIcon />
          </span>
          <h1 className="animate-fade-up mt-6 font-display text-3xl font-bold sm:text-4xl">تم إرسال طلبك بنجاح!</h1>
          <p className="animate-fade-up mt-3 max-w-md text-sm leading-relaxed text-mist" style={{ animationDelay: '0.1s' }}>
            شكراً {fullName.trim()}، سنتواصل معك قريباً على الرقم{' '}
            <span dir="ltr" className="font-bold text-soft">{phone}</span> لتأكيد طلبك.
          </p>

          <div className="animate-fade-up mt-8 w-full rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-right" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center gap-4 border-b border-white/10 pb-4">
              <img src={product.image} alt={product.title} className="h-16 w-16 rounded-xl border border-white/10 bg-white/[0.04] object-contain" />
              <div className="min-w-0">
                <p className="truncate font-display font-bold text-white">{product.title}</p>
                <p className="mt-0.5 text-xs text-mist">{product.weight} • الكمية {quantity}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-mist">السعر</span>
                <span className="font-bold text-white">{formatPrice(product.price)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-mist">الكمية</span>
                <span className="font-bold text-white">{quantity}</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-3">
                <span className="font-bold text-white">الإجمالي</span>
                <span className="font-display text-xl font-bold text-purple">{formatPrice(total)}</span>
              </div>
            </div>
          </div>

          <div className="animate-fade-up mt-8 flex flex-col gap-3 sm:flex-row" style={{ animationDelay: '0.3s' }}>
            <button
              type="button"
              onClick={() => navigate('/store')}
              className="rounded-full bg-gradient-to-l from-violet to-purple px-8 py-3 font-display font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105"
            >
              العودة للمتجر
            </button>
            <Link
              to="/"
              className="rounded-full border border-white/10 bg-white/[0.04] px-8 py-3 font-display font-bold text-mist transition-colors hover:border-violet/40 hover:text-white"
            >
              الرجوع للرئيسية
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-night font-body text-white">
      <div className="pointer-events-none fixed -end-32 -top-32 h-96 w-96 rounded-full bg-violet/10 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none fixed -bottom-32 -start-32 h-96 w-96 rounded-full bg-purple/10 blur-3xl" aria-hidden="true" />

      <div className="relative mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="flex justify-end">
          <Link
            to="/store"
            className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-violet/40 hover:text-white"
          >
            <BackArrow />
            رجوع للمتجر
          </Link>
        </div>

        <header className="mt-8 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet/30 bg-violet/10 px-5 py-2 text-sm font-medium text-soft">
            إتمام الطلب
          </span>
          <h1 className="mt-4 font-display text-3xl font-bold sm:text-4xl">
            املأ بياناتك <span className="text-purple">لإتمام الطلب</span>
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-mist">
            لا تحتاج لتسجيل الدخول، فقط أدخل معلوماتك وسنتصل بك للتأكيد.
          </p>
        </header>

        <div className="mt-10 grid gap-6 lg:grid-cols-5 lg:gap-8">
          <form onSubmit={handleSubmit} noValidate className="lg:col-span-3">
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold text-white">معلومات التوصيل</h2>
              <div className="mt-5 space-y-4">
                <Field
                  id="co-name"
                  label="الاسم الكامل"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: محمد بن علي"
                  autoComplete="name"
                />
                <Field
                  id="co-phone"
                  label="رقم الهاتف"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0550 12 34 56"
                  autoComplete="tel"
                  dir="ltr"
                  className="text-left"
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="co-wilaya"
                    label="الولاية"
                    value={wilaya}
                    onChange={(e) => setWilaya(e.target.value)}
                    placeholder="مثال: الجزائر"
                    autoComplete="address-level1"
                  />
                  <Field
                    id="co-commune"
                    label="البلدية"
                    value={commune}
                    onChange={(e) => setCommune(e.target.value)}
                    placeholder="مثال: باب الزوار"
                    autoComplete="address-level2"
                  />
                </div>

                <div className="text-right">
                  <label className="mb-2 block text-sm font-semibold text-soft">الكمية</label>
                  <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/10 bg-night/60 p-1.5">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.min(99, Math.max(1, q + 1)))}
                      className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-l from-violet to-purple text-lg font-bold text-white transition-transform hover:scale-105"
                      aria-label="زيادة الكمية"
                    >
                      +
                    </button>
                    <span className="w-8 text-center font-display text-lg font-bold text-white" dir="ltr">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-lg font-bold text-mist transition-colors hover:text-white"
                      aria-label="إنقاص الكمية"
                    >
                      −
                    </button>
                  </div>
                </div>

                {fieldError && <ErrorNote>{fieldError}</ErrorNote>}
                {error && <ErrorNote>{error}</ErrorNote>}

                <button
                  type="submit"
                  disabled={saving}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-8 py-3.5 font-display text-base font-bold text-white shadow-xl shadow-violet/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {saving ? <Spinner /> : null}
                  {saving ? 'جارٍ الإرسال…' : 'تأكيد الطلب'}
                </button>
              </div>
            </div>
          </form>

          <aside className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8">
              <h2 className="font-display text-lg font-bold text-white">ملخص الطلب</h2>
              <div className="mt-5 flex items-center gap-4">
                <img
                  src={product.image}
                  alt={product.title}
                  className="h-20 w-20 shrink-0 rounded-2xl border border-white/10 bg-white/[0.04] object-contain"
                />
                <div className="min-w-0">
                  <p className="truncate font-display font-bold text-white">{product.title}</p>
                  <p className="mt-0.5 text-xs text-mist">{product.category} • {product.weight}</p>
                  <p className="mt-1 font-display text-lg font-bold text-purple">{formatPrice(product.price)}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3 border-t border-white/10 pt-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-mist">السعر للوحدة</span>
                  <span className="font-bold text-white">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-mist">الكمية</span>
                  <span className="font-bold text-white">{quantity}</span>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-3">
                  <span className="font-display font-bold text-white">الإجمالي</span>
                  <span className="font-display text-2xl font-bold text-purple">{formatPrice(total)}</span>
                </div>
              </div>

              <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-xs leading-relaxed text-mist">
                بعد تأكيد الطلب سنتواصل معك هاتفياً لتأكيد العنوان وطريقة الدفع عند الاستلام.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
