import { useEffect, useMemo, useState } from 'react'
import { confirmOrder, deleteOrder, getOrders, getToken } from '../../lib/api'
import type { Order } from '../../lib/api'
import { formatPrice } from '../../lib/format'
import { CartIcon, PackageIcon, TrashIcon } from './icons'

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
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
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
      aria-hidden="true"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  )
}

function MapPinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-3.5 w-3.5"
      aria-hidden="true"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function formatDate(iso: string) {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return '—'
  return date.toLocaleDateString('ar-DZ', { day: 'numeric', month: 'long', year: 'numeric' })
}

type Tab = 'pending' | 'confirmed'

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [tab, setTab] = useState<Tab>('pending')

  const load = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await getOrders(token)
      setOrders(res.orders)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pendingOrders = useMemo(() => orders.filter((o) => o.status === 'pending' && !o.archived), [orders])
  const confirmedOrders = useMemo(() => orders.filter((o) => o.status === 'confirmed' && !o.archived), [orders])

  const totalPayments = useMemo(
    () => confirmedOrders.reduce((sum, o) => sum + (o.product ? o.product.price * o.quantity : 0), 0),
    [confirmedOrders]
  )

  const handleConfirm = async (order: Order) => {
    setBusyId(order._id)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      const res = await confirmOrder(token, order._id)
      setOrders((prev) => prev.map((o) => (o._id === order._id ? res.order : o)))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async (order: Order) => {
    setBusyId(order._id)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      await deleteOrder(token, order._id)
      setOrders((prev) => prev.filter((o) => o._id !== order._id))
      setDeletingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
    } finally {
      setBusyId(null)
    }
  }

  const handleCopy = async (order: Order) => {
    try {
      await navigator.clipboard.writeText(order.phone)
      setCopiedId(order._id)
      setTimeout(() => setCopiedId((cur) => (cur === order._id ? null : cur)), 1800)
    } catch {
      setError('تعذّر نسخ الرقم')
    }
  }

  const OrderCard = ({ order }: { order: Order }) => {
    const total = order.product ? order.product.price * order.quantity : 0
    const pending = order.status === 'pending'
    return (
      <article className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors hover:border-violet/40">
        <div className="pointer-events-none h-px bg-gradient-to-l from-transparent via-violet-400/60 to-transparent" aria-hidden="true" />

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={order.product?.image}
                alt={order.product?.title}
                className="h-16 w-16 rounded-xl border border-white/10 bg-white/[0.04] object-contain"
              />
              <span className="absolute -bottom-1.5 -start-1.5 flex h-6 min-w-6 items-center justify-center rounded-full bg-gradient-to-l from-violet to-purple px-1.5 text-[11px] font-bold text-white shadow-lg">
                {order.quantity}
              </span>
            </div>
            <div className="min-w-0">
              <h3 className="truncate font-display text-base font-bold text-white">
                {order.product?.title ?? 'منتج محذوف'}
              </h3>
              <p className="mt-0.5 text-xs text-mist">
                {order.product?.category ?? '—'} • {order.product?.weight ?? '—'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                pending ? 'bg-amber-400/10 text-amber-300' : 'bg-emerald-400/10 text-emerald-300'
              }`}
            >
              {pending ? 'قيد الانتظار' : 'مؤكد'}
            </span>
            <div className="text-end">
              <p className="font-display text-xl font-bold text-purple">{order.product ? formatPrice(total) : '—'}</p>
              <p className="text-[11px] text-mist">{order.product ? `${formatPrice(order.product.price)} × ${order.quantity}` : ''}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 p-4 sm:p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-soft">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-mist">العميل</p>
                <p className="truncate text-sm font-bold text-white">{order.fullName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet/10 text-soft">
                <MapPinIcon />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-mist">العنوان</p>
                <p className="truncate text-sm font-semibold text-white">{order.wilaya} — {order.commune}</p>
              </div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <PhoneIcon />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] text-mist">رقم الهاتف</p>
                <a href={`tel:${order.phone}`} dir="ltr" className="block truncate text-sm font-bold text-white transition-colors hover:text-emerald-300">
                  {order.phone}
                </a>
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => handleCopy(order)}
                className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-colors ${
                  copiedId === order._id
                    ? 'border-emerald-400/40 bg-emerald-400/10 text-emerald-300'
                    : 'border-white/10 bg-white/[0.04] text-mist hover:border-violet/40 hover:text-white'
                }`}
              >
                <CopyIcon />
                {copiedId === order._id ? 'تم النسخ' : 'نسخ'}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-4 py-3.5 sm:px-5">
          <span className="flex items-center gap-1.5 text-xs text-mist">
            <ClockIcon />
            {formatDate(order.createdAt)}
          </span>
          <div className="flex flex-wrap gap-2">
            {deletingId === order._id ? (
              <span className="flex items-center gap-2 text-sm font-bold">
                <span className="text-mist">متأكد من الحذف؟</span>
                <button
                  type="button"
                  disabled={busyId === order._id}
                  onClick={() => handleDelete(order)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-l from-red-500 to-red-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyId === order._id ? <Spinner /> : <TrashIcon />}
                  نعم، احذف
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-mist transition-colors hover:text-white"
                >
                  إلغاء
                </button>
              </span>
            ) : pending ? (
              <>
                <button
                  type="button"
                  disabled={busyId === order._id}
                  onClick={() => handleConfirm(order)}
                  className="flex items-center gap-2 rounded-full bg-gradient-to-l from-emerald-500 to-emerald-400 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-emerald-500/25 transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busyId === order._id ? <Spinner /> : <CheckIcon />}
                  تأكيد الطلب
                </button>
                <button
                  type="button"
                  onClick={() => setDeletingId(order._id)}
                  className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/20"
                >
                  <TrashIcon />
                  حذف
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setDeletingId(order._id)}
                className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/20"
              >
                <TrashIcon />
                حذف الطلب
              </button>
            )}
          </div>
        </div>
      </article>
    )
  }

  const stats = [
    { label: 'الطلبات', value: orders.length, icon: <PackageIcon />, cls: 'from-violet/20 to-purple/20 text-violet' },
    { label: 'قيد الانتظار', value: pendingOrders.length, icon: <ClockIcon />, cls: 'from-amber-400/20 to-amber-300/10 text-amber-300' },
    { label: 'مؤكدة', value: confirmedOrders.length, icon: <CheckIcon />, cls: 'from-emerald-400/20 to-emerald-300/10 text-emerald-300' },
    { label: 'إجمالي المدفوعات', value: formatPrice(totalPayments), icon: <WalletIcon />, cls: 'from-violet/20 to-purple/20 text-violet', valueCls: 'text-lg sm:text-2xl' },
  ]

  const EmptyState = ({ message }: { message: string }) => (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
        <CartIcon />
      </span>
      <p className="mt-4 font-display text-lg font-bold text-white">{message}</p>
      <p className="mt-2 max-w-sm text-sm text-mist">ستظهر الطلبات الجديدة هنا فور وصولها.</p>
    </div>
  )

  return (
    <section className="animate-fade-up">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">طلبات الشراء</h1>
        <p className="mt-1.5 text-sm text-mist">تأكيد الطلبات الواردة، الاتصال بالعملاء، ثم حذفها بعد إتمامها</p>
      </header>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l ${s.cls}`}>{s.icon}</span>
            <div className="min-w-0">
              <p className={`truncate font-display font-bold leading-none text-white ${s.valueCls ?? 'text-2xl'}`}>{s.value}</p>
              <p className="mt-1 truncate text-xs text-mist">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-5 flex gap-2 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
        <button
          type="button"
          onClick={() => setTab('pending')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === 'pending' ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25' : 'text-mist hover:text-white'
          }`}
        >
          قيد الانتظار
          <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === 'pending' ? 'bg-white/20' : 'bg-amber-400/10 text-amber-300'}`}>
            {stats[1].value}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTab('confirmed')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors ${
            tab === 'confirmed' ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25' : 'text-mist hover:text-white'
          }`}
        >
          الطلبات المؤكدة
          <span className={`rounded-full px-2 py-0.5 text-[11px] ${tab === 'confirmed' ? 'bg-white/20' : 'bg-emerald-400/10 text-emerald-300'}`}>
            {stats[2].value}
          </span>
        </button>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      ) : tab === 'pending' ? (
        pendingOrders.length ? (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState message="لا توجد طلبات قيد الانتظار" />
        )
      ) : confirmedOrders.length ? (
        <div className="space-y-4">
          {confirmedOrders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))}
        </div>
      ) : (
        <EmptyState message="لا توجد طلبات مؤكدة بعد" />
      )}
    </section>
  )
}
