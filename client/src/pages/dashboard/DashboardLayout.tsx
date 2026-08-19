import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import logo from '../../assets/Logo.png'
import { useAuth } from '../../auth/context'
import { LogoutDialog } from '../../components/LogoutDialog'
import { CloseIcon, GridIcon, HomeIcon, LogoutIcon, MenuIcon, PackageIcon, UserIcon, UsersIcon, CartIcon } from './icons'

const navItems: { to: string; end?: boolean; label: string; icon: ReactNode }[] = [
  { to: '/dashboard', end: true, label: 'نظرة عامة', icon: <GridIcon /> },
  { to: '/dashboard/users', label: 'المستخدمين', icon: <UsersIcon /> },
  { to: '/dashboard/products', label: 'المنتجات', icon: <PackageIcon /> },
  { to: '/dashboard/orders', label: 'الطلبات', icon: <CartIcon /> },
  { to: '/dashboard/profile', label: 'الملف الشخصي', icon: <UserIcon /> },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { user } = useAuth()

  return (
    <div className="flex h-full flex-col">
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/30'
                  : 'text-mist hover:bg-white/[0.05] hover:text-white'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {user && (
        <Link
          to="/dashboard/profile"
          onClick={onNavigate}
          className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition-colors hover:border-violet/40"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-l from-violet to-purple font-display text-sm font-bold text-white shadow-lg shadow-violet/30">
              {user.fullName.trim().charAt(0)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.fullName}</p>
              <p className="mt-0.5 text-xs text-mist">مشرف النظام</p>
            </div>
          </div>
        </Link>
      )}
    </div>
  )
}

export function DashboardLayout() {
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    setLogoutOpen(false)
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-night font-body text-white">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/5 bg-night/80 backdrop-blur-md">
        <div className="flex h-full items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-soft transition-colors hover:border-violet/40 hover:text-white lg:hidden"
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </button>
            <Link to="/" className="flex items-center">
              <img src={logo} alt="AB Power" className="h-11 w-auto object-contain" />
            </Link>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-mist transition-colors hover:border-violet/40 hover:text-white"
            >
              <HomeIcon />
              <span className="hidden sm:inline">رجوع للرئيسية</span>
            </Link>
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex items-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-4 py-2 text-sm font-bold text-red-300 transition-colors hover:bg-red-400/20"
            >
              <LogoutIcon />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>
        </div>
      </header>

      <aside className="fixed inset-y-0 start-0 top-16 z-30 hidden w-64 border-e border-white/5 bg-night-soft/40 p-4 lg:block">
        <SidebarContent />
      </aside>

      <div
        className={`fixed inset-y-0 start-0 top-16 z-50 w-72 border-e border-white/5 bg-night/95 p-4 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!open}
      >
        <SidebarContent onNavigate={() => setOpen(false)} />
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      <main className="pt-16 lg:ms-64">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-8 lg:py-10">
          <Outlet />
        </div>
      </main>

      <LogoutDialog
        open={logoutOpen}
        onConfirm={handleLogout}
        onCancel={() => setLogoutOpen(false)}
      />
    </div>
  )
}
