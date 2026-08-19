import logo from '../assets/Logo.png'
import { Lightning } from './Lightning'

export function SplashVisual() {
  return (
    <>
      <div className="bg-grid absolute inset-0" aria-hidden="true" />
      <div
        className="animate-pulse-glow absolute -top-1/3 left-1/4 h-80 w-80 rounded-full bg-purple/25 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-orb-slow absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-violet/20 blur-3xl"
        aria-hidden="true"
      />

      <span className="animate-bolt-flicker absolute left-[10%] top-[22%] text-violet/50" aria-hidden="true">
        <Lightning className="glow-bolt h-6 w-6" variant="line" />
      </span>
      <span
        className="animate-bolt-flicker absolute right-[12%] top-[30%] text-purple/45"
        style={{ animationDelay: '0.5s' }}
        aria-hidden="true"
      >
        <Lightning className="glow-bolt h-5 w-5" />
      </span>
      <span
        className="animate-bolt-flicker absolute bottom-[24%] left-[16%] text-violet/40"
        style={{ animationDelay: '1s' }}
        aria-hidden="true"
      >
        <Lightning className="glow-bolt h-5 w-5" />
      </span>
      <span
        className="animate-bolt-flicker absolute bottom-[18%] right-[14%] text-purple/40"
        style={{ animationDelay: '1.6s' }}
        aria-hidden="true"
      >
        <Lightning className="glow-bolt h-6 w-6" variant="line" />
      </span>

      <div className="animate-float relative">
        <img src={logo} alt="AB Power" className="h-32 w-auto object-contain sm:h-36" />
      </div>
    </>
  )
}
