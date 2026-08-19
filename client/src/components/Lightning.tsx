import type { CSSProperties } from 'react'

export function Lightning({
  className = 'h-5 w-5',
  variant = 'solid',
  style,
}: {
  className?: string
  variant?: 'solid' | 'line'
  style?: CSSProperties
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={variant === 'solid' ? 'currentColor' : 'none'}
      stroke={variant === 'solid' ? 'none' : 'currentColor'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      style={style}
      aria-hidden="true"
    >
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
    </svg>
  )
}
