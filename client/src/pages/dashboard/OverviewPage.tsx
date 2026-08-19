import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../auth/context'
import { getStats, getToken } from '../../lib/api'
import type { DashboardStats } from '../../lib/api'
import { CountUp } from '../../components/CountUp'
import { CartIcon, PackageIcon, UsersIcon } from './icons'

function StatCard({
  label,
  value,
  icon,
}: {
  label: string
  value: number
  icon: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-5">
      <div
        className="pointer-events-none absolute -end-6 -top-8 h-24 w-24 rounded-full bg-violet/10 blur-2xl"
        aria-hidden="true"
      />
      <div className="flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
          {icon}
        </span>
        <p className="text-sm font-semibold text-mist">{label}</p>
      </div>
      <p className="mt-3 font-display text-3xl font-bold text-white">
        <CountUp target={value} />
      </p>
    </div>
  )
}

export function OverviewPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    const token = getToken()
    if (!token) return

    getStats(token)
      .then((res) => {
        if (active) setStats(res.stats)
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
  }, [])

  if (!user) return null

  const firstName = user.fullName.trim().split(' ')[0] || 'مشرف'

  return (
    <section className="animate-fade-up">
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="font-display text-2xl font-bold sm:text-3xl">إحصائيات المشروع</h1>
          <span className="rounded-full bg-gradient-to-l from-violet to-purple px-3.5 py-1 text-xs font-bold text-white shadow-lg shadow-violet/25">
            مشرف
          </span>
        </div>
        <p className="mt-1.5 text-sm text-mist">مرحباً {firstName}، نظرة عامة على أعداد مشروع AB Power</p>
      </header>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
          {error}
        </div>
      ) : stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard label="المستخدمون" value={stats.users} icon={<UsersIcon />} />
          <StatCard label="المنتجات" value={stats.products} icon={<PackageIcon />} />
          <StatCard label="طلبات الشراء" value={stats.orders} icon={<CartIcon />} />
        </div>
      ) : null}
    </section>
  )
}
