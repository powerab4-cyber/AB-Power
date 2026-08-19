import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/Logo.png'
import { Lightning } from './Lightning'
import { LogoutDialog } from './LogoutDialog'
import { useAuth } from '../auth/context'

const navLinks = [
  { label: 'الرئيسية', to: '#home' },
  { label: 'كيف نعمل', to: '#how' },
  { label: 'المتجر', to: '/store' },
  { label: 'تواصل معنا', to: '#contact' },
]

function MenuIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

function GaugeIcon() {
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
      <path d="M12 14 4 4" />
      <circle cx="12" cy="14" r="6" />
    </svg>
  )
}

function LogoutIcon() {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5M21 12H9" />
    </svg>
  )
}

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [logoutOpen, setLogoutOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const isAdmin = user?.role === 'admin'
  const dashboardTo = isAdmin ? '/dashboard' : '/account'
  const dashboardLabel = isAdmin ? 'لوحة التحكم' : 'حسابي'

  const confirmLogout = () => {
    setLogoutOpen(false)
    logout()
    navigate('/')
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-night/70 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center"
          onClick={() => {
            setOpen(false)
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
        >
          <img
            src={logo}
            alt="AB Power"
            className="h-14 w-auto object-contain"
          />
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-mist lg:flex">
          {navLinks.map((link) =>
            link.to.startsWith('#') ? (
              <a
                key={link.to}
                href={link.to}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to={dashboardTo}
                className="relative hidden items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/30 transition-transform hover:scale-105 sm:flex"
              >
                <span className="absolute -inset-px rounded-full bg-gradient-to-l from-violet to-purple opacity-40 blur-sm" aria-hidden="true" />
                <GaugeIcon />
                <span className="relative">{dashboardLabel}</span>
              </Link>
              <button
                type="button"
                onClick={() => setLogoutOpen(true)}
                className="hidden items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-105 sm:flex"
              >
                <LogoutIcon />
                تسجيل الخروج
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-violet/25 transition-transform hover:scale-105 sm:flex"
            >
              <Lightning className="glow-bolt h-4 w-4" />
              ابدأ الآن
            </Link>
          )}

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-soft transition-colors hover:border-violet/40 hover:text-white lg:hidden"
          >
            {open ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div
        className={
          open
            ? 'grid border-t border-white/5 bg-night/90 backdrop-blur-md transition-all duration-300 lg:hidden'
            : 'grid grid-rows-[0fr] border-transparent bg-night/90 transition-all duration-300 lg:hidden'
        }
      >
        <div className="overflow-hidden">
          <nav className="flex flex-col gap-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) =>
              link.to.startsWith('#') ? (
                <a
                  key={link.to}
                  href={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-mist transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-medium text-mist transition-colors hover:bg-white/[0.05] hover:text-white"
                >
                  {link.label}
                </Link>
              ),
            )}
            {user ? (
              <div className="mt-2 flex flex-col gap-2">
                <Link
                  to={dashboardTo}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-6 py-3 text-sm font-bold text-white shadow-lg shadow-violet/30"
                >
                  <GaugeIcon />
                  {dashboardLabel}
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false)
                    setLogoutOpen(true)
                  }}
                  className="flex items-center justify-center gap-2 rounded-full border border-red-400/40 bg-red-400/10 px-6 py-3 text-sm font-bold text-red-300"
                >
                  <LogoutIcon />
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-6 py-3 text-sm font-bold text-white sm:hidden"
              >
                <Lightning className="glow-bolt h-4 w-4" />
                ابدأ الآن
              </Link>
            )}
          </nav>
        </div>
      </div>

      <LogoutDialog
        open={logoutOpen}
        onConfirm={confirmLogout}
        onCancel={() => setLogoutOpen(false)}
      />
      </header>
    </>
  )
}
