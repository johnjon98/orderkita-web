import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, AuthTokens, JWTClaims } from '@/types/auth'
import { setTokens, clearTokens } from '@/lib/api/base'

function decodeJwt(token: string): JWTClaims | null {
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload)) as JWTClaims
  } catch {
    return null
  }
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  claims: JWTClaims | null

  setAuth(tokens: AuthTokens, user: User): void
  setTokens(tokens: AuthTokens): void
  setUser(user: User): void
  clear(): void
  isAuthenticated(): boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      claims: null,

      setAuth(tokens, user) {
        setTokens(tokens.access, tokens.refresh)
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          user,
          claims: decodeJwt(tokens.access),
        })
      },

      setTokens(tokens) {
        setTokens(tokens.access, tokens.refresh)
        set({
          accessToken: tokens.access,
          refreshToken: tokens.refresh,
          claims: decodeJwt(tokens.access),
        })
      },

      setUser(user) {
        set({ user })
      },

      clear() {
        clearTokens()
        set({ accessToken: null, refreshToken: null, user: null, claims: null })
      },

      isAuthenticated() {
        const { accessToken, claims } = get()
        if (!accessToken || !claims) return false
        return claims.exp * 1000 > Date.now()
      },
    }),
    {
      name: 'ok-auth',
      partialState: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        claims: state.claims,
      }),
    } as Parameters<typeof persist>[1]
  )
)
