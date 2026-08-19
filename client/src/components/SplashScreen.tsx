import { useEffect, useState } from 'react'
import { SplashVisual } from './Splash'
import { useBodyScrollLock } from '../hooks/useBodyScrollLock'

const SPLASH_MS = 2000
const FADE_MS = 700

export function SplashScreen({ onFinished }: { onFinished: () => void }) {
  const [fading, setFading] = useState(false)
  useBodyScrollLock()

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const showMs = reduced ? 300 : SPLASH_MS
    const fadeMs = reduced ? 150 : FADE_MS

    const showTimer = window.setTimeout(() => setFading(true), showMs)
    const doneTimer = window.setTimeout(onFinished, showMs + fadeMs)

    return () => {
      window.clearTimeout(showTimer)
      window.clearTimeout(doneTimer)
    }
  }, [onFinished])

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-night transition-opacity duration-700 ${
        fading ? 'pointer-events-none opacity-0' : ''
      }`}
    >
      <SplashVisual />
      <div className="relative mt-10 h-1 w-56 overflow-hidden rounded-full bg-white/5 sm:w-64" aria-hidden="true">
        <div className="splash-bar h-full w-full rounded-full bg-gradient-to-l from-violet to-purple shadow-[0_0_12px_rgba(147,71,209,0.6)]" />
      </div>
    </div>
  )
}
