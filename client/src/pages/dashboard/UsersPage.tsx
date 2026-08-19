import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { useAuth } from '../../auth/context'
import { deleteUser, getToken, getUsers } from '../../lib/api'
import type { User } from '../../lib/api'
import { CountUp } from '../../components/CountUp'
import { SearchIcon, TrashIcon, UserIcon, UsersIcon } from './icons'

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

function ShieldIcon() {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function initialsOf(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase()
}

type RoleFilter = 'all' | 'admin' | 'client'

type RowActions = {
  me: User | null
  deletingId: string | null
  busyId: string | null
  onAskDelete: (id: string) => void
  onCancelDelete: () => void
  onDelete: (user: User) => void
}

function UserRow({ user, index: _index, ...actions }: RowActions & { user: User; index: number }) {
  const { me, deletingId, busyId, onAskDelete, onCancelDelete, onDelete } = actions
  const isMe = me?._id === user._id
  const isAdmin = user.role === 'admin'
  const deleting = deletingId === user._id
  const busy = busyId === user._id
  return (
    <article className="group flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:border-violet/40 hover:bg-white/[0.05]">
      <span
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-sm font-bold text-white shadow-lg ${
          isAdmin
            ? 'from-violet to-purple shadow-violet/40'
            : 'from-emerald-400 to-teal-500 shadow-emerald-400/30'
        }`}
      >
        {initialsOf(user.fullName)}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="truncate text-sm font-bold leading-tight text-white">{user.fullName}</p>
          {isMe && (
            <span className="rounded-full border border-violet/40 bg-violet/10 px-2 py-0.5 text-[10px] font-bold text-soft">
              أنت
            </span>
          )}
        </div>
        <p dir="ltr" className="truncate text-xs text-mist">
          {user.email}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        <span
          className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${
            isAdmin ? 'border-violet/40 bg-violet/10 text-soft' : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
          }`}
        >
          <ShieldIcon />
          {isAdmin ? 'مشرف' : 'عميل'}
        </span>

        {isMe ? (
          <span
            title="لا يمكن حذف حسابك الحالي"
            className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-white/10 text-mist/30"
          >
            <TrashIcon />
          </span>
        ) : deleting ? (
          <div className="flex items-center gap-2 rounded-2xl border border-red-400/30 bg-red-400/10 px-3 py-2 animate-pop-in">
            <span className="hidden text-xs font-bold text-red-200 md:block">حذف الحساب نهائياً؟</span>
            <button
              type="button"
              disabled={busy}
              onClick={() => onDelete(user)}
              className="flex items-center gap-1.5 rounded-full bg-gradient-to-l from-red-500 to-red-400 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-red-500/25 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? <Spinner /> : <TrashIcon />}
              نعم، احذف
            </button>
            <button
              type="button"
              onClick={onCancelDelete}
              className="rounded-full border border-white/10 px-3.5 py-1.5 text-xs font-bold text-mist transition-colors hover:text-white"
            >
              إلغاء
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => onAskDelete(user._id)}
            title="حذف الحساب"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-400/30 bg-red-400/10 text-red-300 transition-colors hover:bg-red-400/20 hover:text-red-200"
          >
            <TrashIcon />
          </button>
        )}
      </div>
    </article>
  )
}

function Group({
  title,
  count,
  icon,
  tone,
  members,
  ...actions
}: RowActions & { title: string; count: number; icon: ReactNode; tone: string; members: User[] }) {
  if (!count) return null
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center gap-3">
        <span className={`flex h-8 w-8 items-center justify-center rounded-xl ${tone}`}>{icon}</span>
        <h2 className="font-display text-base font-bold text-white">{title}</h2>
        <span className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs font-bold text-mist">
          <CountUp target={count} />
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-violet/30 to-transparent" aria-hidden="true" />
      </div>
      <div className="space-y-3">
        {members.map((user, i) => (
          <UserRow key={user._id} user={user} index={i} {...actions} />
        ))}
      </div>
    </div>
  )
}

export function UsersPage() {
  const { user: me } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('')
  const [role, setRole] = useState<RoleFilter>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const load = async () => {
    const token = getToken()
    if (!token) return
    try {
      const res = await getUsers(token)
      setUsers(res.users)
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ، حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const searched = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return users
    return users.filter((u) => u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q))
  }, [users, filter])

  const admins = useMemo(() => searched.filter((u) => u.role === 'admin'), [searched])
  const clients = useMemo(() => searched.filter((u) => u.role === 'client'), [searched])
  const adminTotal = useMemo(() => users.filter((u) => u.role === 'admin').length, [users])
  const clientTotal = useMemo(() => users.filter((u) => u.role === 'client').length, [users])

  const handleDelete = async (target: User) => {
    setBusyId(target._id)
    setError('')
    try {
      const token = getToken()
      if (!token) throw new Error('غير مصرح')
      await deleteUser(token, target._id)
      setUsers((prev) => prev.filter((u) => u._id !== target._id))
      setDeletingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ أثناء الحذف')
      setDeletingId(null)
    } finally {
      setBusyId(null)
    }
  }

  const handleAskDelete = (id: string) => setDeletingId(id)
  const handleCancelDelete = () => setDeletingId(null)

  const stats = [
    { label: 'إجمالي المستخدمين', value: users.length, icon: <UsersIcon />, cls: 'from-violet/20 to-purple/20 text-violet', tone: 'border-violet/30' },
    { label: 'مشرفون', value: adminTotal, icon: <ShieldIcon />, cls: 'from-violet/20 to-purple/20 text-violet', tone: 'border-violet/30' },
    { label: 'عملاء', value: clientTotal, icon: <UserIcon />, cls: 'from-emerald-400/20 to-emerald-300/10 text-emerald-300', tone: 'border-emerald-400/30' },
  ]

  const tabs: { key: RoleFilter; label: string; count: number; tone: string }[] = [
    { key: 'all', label: 'الكل', count: searched.length, tone: 'text-violet' },
    { key: 'admin', label: 'مشرفون', count: admins.length, tone: 'text-violet' },
    { key: 'client', label: 'عملاء', count: clients.length, tone: 'text-emerald-300' },
  ]

  const rowActions: RowActions = {
    me,
    deletingId,
    busyId,
    onAskDelete: handleAskDelete,
    onCancelDelete: handleCancelDelete,
    onDelete: handleDelete,
  }

  const roleList = role === 'admin' ? admins : role === 'client' ? clients : null
  const noResults = searched.length === 0 || (roleList !== null && roleList.length === 0)

  return (
    <section className="animate-fade-up">
      <header className="mb-6">
        <h1 className="font-display text-2xl font-bold sm:text-3xl">إدارة المستخدمين</h1>
        <p className="mt-1.5 text-sm text-mist">دليل حسابات المتجر — المشرفون والعملاء</p>
      </header>

      <div className="mb-6 grid grid-cols-3 gap-3">
        {stats.map((s) => (
          <div key={s.label} className={`flex items-center gap-3 rounded-2xl border bg-white/[0.03] p-4 ${s.tone}`}>
            <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l ${s.cls}`}>
              {s.icon}
            </span>
            <div className="min-w-0">
              <p className="truncate font-display text-2xl font-bold leading-none text-white">
                <CountUp target={s.value} />
              </p>
              <p className="mt-1 truncate text-xs text-mist">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative flex-1">
          <SearchIcon className="pointer-events-none absolute start-4 top-1/2 h-5 w-5 -translate-y-1/2 text-mist" />
          <input
            type="search"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="ابحث بالاسم أو البريد الإلكتروني…"
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-5 pr-12 text-white placeholder:text-mist/50 backdrop-blur transition-colors focus:border-violet/50 focus:outline-none focus:ring-2 focus:ring-purple/60"
          />
        </div>
        <div className="flex gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setRole(t.key)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition-all sm:flex-none ${
                role === t.key
                  ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25'
                  : 'text-mist hover:text-white'
              }`}
            >
              {t.label}
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] ${
                  role === t.key ? 'bg-white/20 text-white' : `bg-white/[0.06] ${t.tone}`
                }`}
              >
                {t.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-5 rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
          {error}
        </div>
      )}

      {loading ? (
        <div className="space-y-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="h-12 w-12 animate-pulse rounded-2xl bg-white/10" />
              <div className="flex-1 space-y-2">
                <div className="h-3.5 w-1/3 animate-pulse rounded-full bg-white/10" />
                <div className="h-3 w-1/2 animate-pulse rounded-full bg-white/[0.07]" />
              </div>
              <div className="h-9 w-24 animate-pulse rounded-xl bg-white/10" />
            </div>
          ))}
        </div>
      ) : noResults ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-l from-violet/20 to-purple/20 text-violet">
            <UsersIcon />
          </span>
          <p className="mt-4 font-display text-lg font-bold text-white">
            {filter || role !== 'all' ? 'لا توجد نتائج مطابقة' : 'لا يوجد مستخدمون بعد'}
          </p>
          <p className="mt-2 max-w-sm text-sm text-mist">
            {filter || role !== 'all'
              ? 'جرّب كلمة بحث أخرى أو غيّر الفلتر.'
              : 'عندما يسجّل العملاء في المتجر ستظهر حساباتهم هنا.'}
          </p>
        </div>
      ) : roleList ? (
        <div className="space-y-3">
          {roleList.map((user, i) => (
            <UserRow key={user._id} user={user} index={i} {...rowActions} />
          ))}
        </div>
      ) : (
        <>
          <Group
            title="المشرفون"
            count={admins.length}
            icon={<ShieldIcon />}
            tone="bg-violet/10 text-violet"
            members={admins}
            {...rowActions}
          />
          <Group
            title="العملاء"
            count={clients.length}
            icon={<UsersIcon />}
            tone="bg-emerald-400/10 text-emerald-300"
            members={clients}
            {...rowActions}
          />
        </>
      )}
    </section>
  )
}
