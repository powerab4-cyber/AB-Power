import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { ApiError, getMe, getToken, login as apiLogin, setToken, signup as apiSignup } from '../lib/api'
import type { AuthResponse, SignupPayload, User } from '../lib/api'
import { AuthContext } from './context'
import type { AuthContextValue } from './context'

const RETRY_COUNT = 3
const RETRY_BASE_DELAY_MS = 400

let mePromise: Promise<{ success: true; user: User }> | null = null

function fetchMe(token: string) {
  if (!mePromise) {
    mePromise = getMe(token)
    const clear = () => {
      mePromise = null
    }
    mePromise.then(clear, clear)
  }
  return mePromise
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      setLoading(false)
      return
    }

    let cancelled = false

    const attempt = async (tries: number): Promise<void> => {
      try {
        const res = await fetchMe(token)
        if (!cancelled) setUser(res.user)
      } catch (err) {
        if (cancelled) return
        const status = err instanceof ApiError ? err.status : undefined
        if (status === 401) {
          setToken(null)
          return
        }
        if (tries > 0) {
          const delay = RETRY_BASE_DELAY_MS * (RETRY_COUNT - tries + 1)
          await new Promise((resolve) => window.setTimeout(resolve, delay))
          if (!cancelled) await attempt(tries - 1)
        }
      }
    }

    attempt(RETRY_COUNT).finally(() => {
      if (!cancelled) setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [])

  const applyAuth = (res: AuthResponse) => {
    setToken(res.token)
    setUser(res.user)
  }

  const login = async (email: string, password: string) => {
    applyAuth(await apiLogin(email, password))
  }

  const signup = async (payload: SignupPayload) => {
    applyAuth(await apiSignup(payload))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const updateUser = (next: User) => setUser(next)

  const value: AuthContextValue = useMemo(
    () => ({ user, loading, login, signup, logout, updateUser }),
    [user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
