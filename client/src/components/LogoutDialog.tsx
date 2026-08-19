import { useEffect } from 'react'
import { createPortal } from 'react-dom'

function LogoutMarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-6 w-6"
      aria-hidden="true"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  )
}

export function LogoutDialog({
  open,
  onConfirm,
  onCancel,
}: {
  open: boolean
  onConfirm: () => void
  onCancel: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onCancel])

  if (!open) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4 py-10"
      role="dialog"
      aria-modal="true"
      aria-labelledby="logout-dialog-title"
    >
      <div
        className="animate-backdrop-in absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="animate-pop-in relative w-full max-w-md">
        <div
          className="pointer-events-none absolute -inset-2 rounded-[2rem] bg-gradient-to-l from-red-500/30 via-violet/20 to-purple/30 opacity-60 blur-2xl"
          aria-hidden="true"
        />

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-night-soft shadow-2xl shadow-black/70">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-l from-transparent via-red-400/70 to-transparent" aria-hidden="true" />

          <div
            className="pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full bg-red-500/15 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-16 -start-16 h-40 w-40 rounded-full bg-violet/15 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative px-6 py-9 text-center sm:px-8">
            <div className="relative mx-auto h-20 w-20">
              <span
                className="animate-pulse-glow absolute inset-0 rounded-full bg-red-500/25 blur-xl"
                aria-hidden="true"
              />
              <span
                className="absolute -inset-3 animate-spin rounded-full border-2 border-dashed border-red-400/25"
                aria-hidden="true"
              />
              <span className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-l from-red-500 to-red-400 text-white shadow-lg shadow-red-500/40">
                <LogoutMarkIcon />
              </span>
            </div>

          <h2 id="logout-dialog-title" className="mt-5 font-display text-2xl font-bold text-white">
            تسجيل الخروج
          </h2>
          <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-mist">
            هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
          </p>
          <p className="mx-auto mt-3 max-w-xs text-xs leading-relaxed text-mist/70">
            ستُسجَّل خارج حسابك وتحتاج إلى تسجيل الدخول مجدداً للمتابعة.
          </p>

          <div
            className="mx-auto mt-7 h-px max-w-xs bg-gradient-to-l from-transparent via-white/15 to-transparent"
            aria-hidden="true"
          />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-mist transition-colors hover:border-violet/40 hover:text-white"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-l from-red-500 to-red-400 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-red-500/30 transition-all hover:scale-[1.03] hover:shadow-xl hover:shadow-red-500/40"
            >
              <LogoutMarkIcon />
              تسجيل الخروج
            </button>
          </div>
        </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
