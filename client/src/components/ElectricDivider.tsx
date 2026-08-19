import { Lightning } from './Lightning'

export function ElectricDivider() {
  return (
    <div className="relative mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6">
      <div className="h-px w-full bg-gradient-to-l from-transparent via-violet/40 to-transparent" />
      <span className="absolute">
        <span className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet/30 blur-2xl" />
        <Lightning className="glow-bolt-lg relative h-6 w-6 text-violet" />
      </span>
    </div>
  )
}
