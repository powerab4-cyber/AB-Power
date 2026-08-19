import { useLayoutEffect } from 'react'

export function useBodyScrollLock(active = true) {
  useLayoutEffect(() => {
    if (!active) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [active])
}
