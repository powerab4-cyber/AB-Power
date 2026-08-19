import { useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'

type FieldProps = {
  id: string
  label: string
  error?: string
  hint?: string
} & InputHTMLAttributes<HTMLInputElement>

export function Field({ id, label, error, hint, className = '', ...inputProps }: FieldProps) {
  return (
    <div className="text-right">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-soft">
        {label}
      </label>
      <input
        id={id}
        className={`w-full rounded-2xl border bg-night/60 px-4 py-3 text-white placeholder:text-mist/40 backdrop-blur transition-colors focus:outline-none focus:ring-2 focus:ring-purple/60 ${
          error ? 'border-red-400/60' : 'border-white/10 focus:border-violet/50'
        } ${className}`}
        {...inputProps}
      />
      {hint && !error && <p className="mt-1.5 text-xs text-mist/70">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function EyeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-5 w-5"
      aria-hidden="true"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="m1 1 22 22" />
    </svg>
  )
}

type PasswordFieldProps = Omit<FieldProps, 'type'>

export function PasswordField({
  id,
  label,
  error,
  hint,
  className = '',
  ...inputProps
}: PasswordFieldProps) {
  const [show, setShow] = useState(false)

  return (
    <div className="text-right">
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-soft">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          className={`w-full rounded-2xl border bg-night/60 py-3 pr-4 pl-12 text-white placeholder:text-mist/40 backdrop-blur transition-colors focus:outline-none focus:ring-2 focus:ring-purple/60 ${
            error ? 'border-red-400/60' : 'border-white/10 focus:border-violet/50'
          } ${className}`}
          {...inputProps}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={show ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-mist transition-colors hover:text-white"
        >
          {show ? <EyeOffIcon /> : <EyeIcon />}
        </button>
      </div>
      {hint && !error && <p className="mt-1.5 text-xs text-mist/70">{hint}</p>}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

type ChipGroupProps = {
  id: string
  label: string
  options: string[]
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  error?: string
}

export function ChipGroup({
  label,
  options,
  value,
  onChange,
  multiple = false,
  error,
}: ChipGroupProps) {
  const toggle = (option: string) => {
    if (multiple) {
      const list = value as string[]
      onChange(list.includes(option) ? list.filter((o) => o !== option) : [...list, option])
    } else {
      onChange(value === option ? '' : option)
    }
  }

  return (
    <div className="text-right">
      <label className="mb-2 block text-sm font-semibold text-soft">{label}</label>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {options.map((option) => {
          const selected = multiple ? (value as string[]).includes(option) : value === option
          return (
            <button
              key={option}
              type="button"
              onClick={() => toggle(option)}
              aria-pressed={selected}
              className={`rounded-2xl border px-3.5 py-2.5 text-sm font-semibold transition-all duration-200 ${
                selected
                  ? 'border-violet/60 bg-gradient-to-l from-violet to-purple text-white shadow-lg shadow-violet/25'
                  : 'border-white/10 bg-white/[0.04] text-mist hover:border-violet/40 hover:text-white'
              }`}
            >
              {option}
            </button>
          )
        })}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  )
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5 animate-spin" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" strokeWidth="4" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    </svg>
  )
}

export function SubmitButton({ loading = false, children }: { loading?: boolean; children: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-l from-violet to-purple px-9 py-3.5 font-display text-lg font-bold text-white shadow-xl shadow-violet/30 transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? <Spinner /> : children}
    </button>
  )
}

export function SuccessNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300">
      {children}
    </p>
  )
}

export function ErrorNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
      {children}
    </p>
  )
}
