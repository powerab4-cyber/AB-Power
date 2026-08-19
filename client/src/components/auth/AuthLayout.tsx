import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import logo from '../../assets/Logo.png'
import { Lightning } from '../Lightning'

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

export function AuthLayout({
  title,
  subtitle,
  children,
  wide = false,
}: {
  title: string
  subtitle: string
  children: ReactNode
  wide?: boolean
}) {
  return (
    <div className="relative flex min-h-svh flex-col bg-night font-body text-white">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <img src="/images/gym.webp" alt="" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-night via-night/70 to-night/50" />
        <div className="absolute inset-0 bg-violet/20 mix-blend-multiply" />
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="bg-noise absolute inset-0" />
        <div className="absolute left-1/2 top-1/3 h-96 w-[50rem] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/25 blur-3xl" />
        <div className="absolute -right-24 top-24 h-80 w-80 rounded-full bg-purple/20 blur-3xl" />
        <div className="absolute -left-24 bottom-24 h-80 w-80 rounded-full bg-violet/20 blur-3xl" />
      </div>

      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="flex items-center">
          <img src={logo} alt="AB Power" className="h-12 w-auto object-contain sm:h-14" />
        </Link>
        <Link
          to="/"
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-mist transition-colors hover:border-violet/40 hover:text-white"
        >
          <BackArrow />
          رجوع للرئيسية
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 flex-col px-4 pb-12 sm:px-6">
        <div className={`m-auto w-full ${wide ? 'max-w-lg' : 'max-w-sm sm:max-w-md'}`}>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-night/70 p-5 shadow-2xl shadow-violet/20 backdrop-blur-xl sm:p-7">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-violet/60 to-transparent" />
            <div className="mb-5 text-center">
              <span className="glow-bolt-lg mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-l from-violet to-purple text-white">
                <Lightning className="h-6 w-6" />
              </span>
              <h1 className="mt-4 font-display text-xl font-bold sm:text-3xl">{title}</h1>
              <p className="mt-2 text-mist">{subtitle}</p>
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
