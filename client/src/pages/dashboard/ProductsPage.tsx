import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAdminProducts, deleteProduct, getToken } from '../../lib/api'
import type { Product } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { PackageIcon, SearchIcon, PlusIcon, EditIcon, TrashIcon } from './icons'

function StatusBadge({ active }: { active: boolean }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        active ? 'bg-emerald-400/10 text-emerald-300' : 'bg-red-400/10 text-red-300'
      }`}
    >
      {active ? 'نشط' : 'موقوف'}
    </span>
  )
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [pageError, setPageError] = useState('')
  const [filter, setFilter] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await getAdminProducts(token)
      setProducts(res.products)
      setPageError('')
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return products
    return products.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
  }, [products, filter])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    setPageError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      await deleteProduct(token, id)
      setProducts((prev) => prev.filter((p) => p._id !== id))
      setDeletingId(null)
    } catch (err) {
      setPageError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
      setDeletingId(null)
    }
  }

  return (
    <section className="animate-fade-up">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">إدارة المنتجات</h1>
          <p className="mt-1.5 text-sm text-mist">إنشاء وتعديل وحذف منتجات المتجر مع البحث بالاسم</p>
        </div>
        <Link
          to="/dashboard/products/new"
          className="flex items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105"
        >
          <PlusIcon />
          إضافة منتج
        </Link>
      </header>

      <div className="relative mb-5">
        <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist" />
        <input
          type="search"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="ابحث بالاسم أو التصنيف…"
          className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-5 pr-12 text-white placeholder:text-mist/50 backdrop-blur transition-colors focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-purple/60"
        />
      </div>

      {pageError && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
          {pageError}
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {filtered.map((product) => (
            <article
              key={product._id}
              className="flex gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-violet/40"
            >
              <img
                src={product.image}
                alt={product.title}
                className="h-24 w-24 shrink-0 rounded-xl border border-white/10 bg-white/[0.04] object-contain"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="truncate font-display text-base font-bold text-white">{product.title}</h3>
                  <StatusBadge active={product.active} />
                </div>
                <p className="mt-0.5 text-xs text-mist">{product.category} • {product.weight}</p>
                <p className="mt-1 font-display text-lg font-bold text-purple">{formatPrice(product.price)}</p>
                <div className="mt-2 flex items-center gap-2">
                  <Link
                    to={`/dashboard/products/${product._id}/edit`}
                    className="flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet/10 px-3.5 py-1.5 text-xs font-bold text-soft transition-colors hover:bg-gradient-to-l hover:from-violet hover:to-purple hover:text-white"
                  >
                    <EditIcon />
                    تعديل
                  </Link>
                  {deletingId === product._id ? (
                    <span className="flex items-center gap-2 text-xs font-bold">
                      <span className="text-mist">متأكد؟</span>
                      <button
                        type="button"
                        onClick={() => handleDelete(product._id)}
                        className="rounded-full bg-gradient-to-l from-red-500 to-red-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/25"
                      >
                        نعم، احذف
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeletingId(null)}
                        className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-mist transition-colors hover:text-white"
                      >
                        إلغاء
                      </button>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setDeletingId(product._id)}
                      className="flex items-center gap-1.5 rounded-full border border-red-400/40 bg-red-400/10 px-3.5 py-1.5 text-xs font-bold text-red-300 transition-colors hover:bg-red-400/20"
                    >
                      <TrashIcon />
                      حذف
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
            <PackageIcon />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-white">
            {filter ? 'لا توجد نتائج مطابقة' : 'لا توجد منتجات بعد'}
          </p>
          <p className="mt-2 max-w-sm text-sm text-mist">
            {filter ? 'جرّب كلمة بحث أخرى.' : 'اضغط على "إضافة منتج" لإنشاء أول منتج.'}
          </p>
        </div>
      )}
    </section>
  )
}
