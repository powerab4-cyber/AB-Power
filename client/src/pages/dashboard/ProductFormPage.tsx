import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  createProduct,
  deleteProduct,
  getAdminProducts,
  getToken,
  updateProduct,
  uploadImage,
} from '../../lib/api'
import type { Product } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { PackageIcon, TrashIcon } from './icons'

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

function UploadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <path d="m17 8-5-5-5 5M12 3v12" />
    </svg>
  )
}

function XIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function Section({ step, title, children }: { step: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet-400/60 to-transparent" aria-hidden="true" />
      <div className="flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-l from-violet to-purple font-display text-sm font-bold text-white shadow-lg shadow-violet/30">
          {step}
        </span>
        <h2 className="font-display text-lg font-bold text-white">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  )
}

const inputCls =
  'w-full rounded-2xl border border-white/10 bg-night/60 px-4 py-3 text-white placeholder:text-mist/40 backdrop-blur transition-colors focus:outline-none focus:ring-2 focus:ring-purple/60 focus:border-violet/50'

const labelCls = 'mb-2 block text-sm font-semibold text-soft'

const emptyForm = {
  image: '',
  category: '',
  title: '',
  description: '',
  weight: '',
  price: '',
  active: true,
}

export function ProductFormPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const editing = Boolean(id)

  const [form, setForm] = useState(emptyForm)
  const [loading, setLoading] = useState(editing)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    let active = true
    const token = getToken()
    if (!token) return
    getAdminProducts(token)
      .then((res) => {
        const product = res.products.find((p: Product) => p._id === id)
        if (!active) return
        if (!product) {
          setError('المنتج غير موجود')
          return
        }
        setForm({
          image: product.image,
          category: product.category,
          title: product.title,
          description: product.description,
          weight: product.weight,
          price: String(product.price ?? ''),
          active: product.active,
        })
      })
      .catch((err) => {
        if (active) setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      const res = await uploadImage(token, file)
      setForm((f) => ({ ...f, image: res.url }))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'تعذّر رفع الصورة')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.image) return setError('صورة المنتج مطلوبة')
    if (!form.title.trim()) return setError('عنوان المنتج مطلوب')
    if (!form.category.trim()) return setError('التصنيف مطلوب')
    if (!form.description.trim()) return setError('وصف المنتج مطلوب')
    if (!form.weight.trim()) return setError('وزن المنتج مطلوب')
    const price = Number(form.price)
    if (Number.isNaN(price) || price < 0) return setError('أدخل سعراً صحيحاً')

    setSaving(true)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      const payload = {
        image: form.image,
        category: form.category.trim(),
        title: form.title.trim(),
        description: form.description.trim(),
        weight: form.weight.trim(),
        price,
        active: form.active,
      }
      if (id) {
        await updateProduct(token, id, payload)
      } else {
        await createProduct(token, payload)
      }
      navigate('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setSaving(true)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      await deleteProduct(token, id)
      navigate('/dashboard/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
      setSaving(false)
    }
  }

  const price = Number(form.price)
  const preview = {
    title: form.title.trim() || 'عنوان المنتج',
    description: form.description.trim() || 'وصف مختصر سيظهر للعملاء في المتجر.',
    category: form.category.trim() || 'التصنيف',
    weight: form.weight.trim() || 'الوزن',
    image: form.image,
    price: Number.isNaN(price) || price < 0 ? null : price,
  }

  if (loading) {
    return (
      <section className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-mist">
          <Spinner />
          <span className="text-sm">جارٍ تحميل المنتج…</span>
        </div>
      </section>
    )
  }

  return (
    <section className="animate-fade-up">
      <Link
        to="/dashboard/products"
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-violet/40 hover:text-white"
      >
        <BackArrow />
        رجوع للمنتجات
      </Link>

      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">{editing ? 'تعديل المنتج' : 'إضافة منتج جديد'}</h1>
        <p className="mt-1.5 text-sm text-mist">
          {editing ? 'عدّل بيانات المنتج وشاهد المعاينة المباشرة ثم احفظ.' : 'املأ بيانات المنتج وشاهد كيف سيظهر للعملاء قبل الحفظ.'}
        </p>
      </header>

      <form onSubmit={handleSubmit} noValidate className="grid gap-6 lg:grid-cols-5 lg:gap-8">
        <div className="space-y-5 lg:col-span-3">
          <Section step="1" title="صورة المنتج">
            <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 bg-night/40 px-6 py-8 text-center transition-colors hover:border-violet/40">
              {form.image ? (
                <div className="relative">
                  <img src={form.image} alt="معاينة المنتج" className="h-40 w-40 rounded-2xl border border-white/10 bg-white/[0.04] object-contain" />
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, image: '' }))}
                    aria-label="إزالة الصورة"
                    className="absolute -end-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full border border-red-400/40 bg-night text-red-300 shadow-lg transition-transform hover:scale-110"
                  >
                    <XIcon />
                  </button>
                </div>
              ) : (
                <>
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
                    <UploadIcon />
                  </span>
                  <p className="mt-4 text-sm font-bold text-white">ارفع صورة المنتج</p>
                  <p className="mt-1 text-xs text-mist">JPG أو PNG — تُعرض بوضوح في بطاقة المنتج</p>
                </>
              )}
              <label className="mt-5 cursor-pointer rounded-full border border-violet/40 bg-violet/10 px-5 py-2.5 text-sm font-bold text-soft transition-colors hover:bg-gradient-to-l hover:from-violet hover:to-purple hover:text-white">
                {uploading ? <span className="flex items-center gap-2"><Spinner /> جارٍ الرفع…</span> : form.image ? 'تغيير الصورة' : 'اختر صورة'}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={uploading} />
              </label>
            </div>
          </Section>

          <Section step="2" title="التفاصيل الأساسية">
            <div className="space-y-4">
              <div className="text-right">
                <div className="flex items-center justify-between">
                  <label htmlFor="pf-title" className={labelCls}>عنوان المنتج</label>
                  <span className={`text-xs ${form.title.length > 190 ? 'text-red-300' : 'text-mist'}`}>{form.title.length}/200</span>
                </div>
                <input
                  id="pf-title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value.slice(0, 200) })}
                  placeholder="مثال: واي بروتين"
                  className={inputCls}
                />
              </div>

              <div className="text-right">
                <label htmlFor="pf-category" className={labelCls}>التصنيف</label>
                <input
                  id="pf-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  placeholder="مثال: بروتين"
                  className={inputCls}
                />
              </div>

              <div className="text-right">
                <div className="flex items-center justify-between">
                  <label htmlFor="pf-desc" className={labelCls}>الوصف</label>
                  <span className={`text-xs ${form.description.length > 480 ? 'text-red-300' : 'text-mist'}`}>{form.description.length}/500</span>
                </div>
                <textarea
                  id="pf-desc"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value.slice(0, 500) })}
                  rows={4}
                  placeholder="وصف مختصر يقنع العميل بشراء المنتج…"
                  className={`${inputCls} resize-none`}
                />
              </div>
            </div>
          </Section>

          <Section step="3" title="السعر والحالة">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="text-right">
                <label htmlFor="pf-weight" className={labelCls}>الوزن / الحجم</label>
                <input
                  id="pf-weight"
                  value={form.weight}
                  onChange={(e) => setForm({ ...form, weight: e.target.value })}
                  placeholder="مثال: 1كغ"
                  className={inputCls}
                />
              </div>
              <div className="text-right">
                <label htmlFor="pf-price" className={labelCls}>السعر</label>
                <div className="relative">
                  <input
                    id="pf-price"
                    type="number"
                    min={0}
                    step="50"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder="3500"
                    dir="ltr"
                    className={`${inputCls} text-right pr-14`}
                  />
                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-mist">دج</span>
                </div>
              </div>
            </div>

            <label className="mt-5 flex cursor-pointer items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors hover:border-violet/40">
              <div>
                <p className="text-sm font-semibold text-soft">المنتج متاح في المتجر</p>
                <p className="mt-0.5 text-xs text-mist">عند إيقافه لن يظهر للعملاء ولن يمكن طلبه.</p>
              </div>
              <span className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${form.active ? 'bg-gradient-to-l from-violet to-purple' : 'bg-white/10'}`}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="peer sr-only"
                />
                <span
                  className="inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform"
                  style={{ marginInlineStart: form.active ? '1.5rem' : '0.25rem' }}
                />
              </span>
            </label>
          </Section>

          {error && (
            <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
              {error}
            </p>
          )}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saving || uploading}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-8 py-3.5 font-display text-base font-bold text-white shadow-xl shadow-violet/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70 sm:flex-none sm:min-w-48"
            >
              {saving && <Spinner />}
              {saving ? 'جارٍ الحفظ…' : editing ? 'حفظ التعديلات' : 'نشر المنتج'}
            </button>
            {editing && (
              <button
                type="button"
                disabled={saving}
                onClick={handleDelete}
                className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-6 py-3.5 font-bold text-red-300 transition-colors hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <TrashIcon />
                حذف
              </button>
            )}
          </div>
        </div>

        <aside className="lg:col-span-2">
          <div className="lg:sticky lg:top-8">
            <div className="mb-3 flex items-center gap-2 px-1">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <p className="text-sm font-bold text-soft">معاينة مباشرة</p>
              <p className="text-xs text-mist">— هكذا يظهر للعملاء</p>
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/5 bg-night-soft/60">
              <div className="relative flex aspect-[4/3] items-center justify-center bg-white/[0.04]">
                {preview.image ? (
                  <img src={preview.image} alt="معاينة المنتج" className="h-full w-full object-contain" />
                ) : (
                  <span className="flex flex-col items-center gap-2 text-mist">
                    <PackageIcon />
                    <span className="text-xs">لا صورة بعد</span>
                  </span>
                )}
                <span className="absolute right-3 top-3 rounded-full bg-gradient-to-l from-violet to-purple px-3 py-1 text-xs font-bold text-white">
                  {preview.category}
                </span>
                {!form.active && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white">
                    موقوف
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="truncate font-display text-base font-bold text-white">{preview.title}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-mist">{preview.description}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <span className={`font-display text-xl font-bold ${preview.price !== null ? 'text-purple' : 'text-mist/50'}`}>
                    {preview.price !== null ? formatPrice(preview.price) : '0 دج'}
                  </span>
                  <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-xs font-semibold text-mist">{preview.weight}</span>
                </div>
                <div className="mt-3 w-full rounded-full bg-gradient-to-l from-violet to-purple py-2.5 text-center text-sm font-bold text-white opacity-90 shadow-lg shadow-violet/25">
                  اطلب الآن
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
                <PackageIcon />
              </span>
              <p className="text-xs leading-relaxed text-mist">
                {form.active ? 'سيظهر هذا المنتج فوراً في متجر العملاء.' : 'المنتج موقوف ولن يظهر للعملاء حتى تفعيله.'}
              </p>
            </div>
          </div>
        </aside>
      </form>
    </section>
  )
}
