'use client'

import { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { authApi } from '@/lib/api/auth'
import type { LoginPayload } from '@/lib/api/auth'

export function useAuth() {
  const store = useAuthStore()
  const router = useRouter()

  const login = useCallback(
    async (payload: LoginPayload) => {
      const result = await authApi.login(payload)
      store.setAuth({ access: result.access, refresh: result.refresh }, result.user)

      // Route based on role
      const role = result.user.role
      if (role === 'kitchen_staff') {
        router.push('/kitchen')
      } else if (role === 'merchant_owner' || role === 'merchant_staff') {
        router.push('/dashboard')
      } else {
        router.push('/')
      }
    },
    [store, router]
  )

  const logout = useCallback(async () => {
    if (store.refreshToken) {
      try {
        await authApi.logout(store.refreshToken)
      } catch {
        // Proceed even if logout call fails
      }
    }
    store.clear()
    router.push('/login')
  }, [store, router])

  return {
    user: store.user,
    role: store.claims?.role ?? null,
    merchantId: store.claims?.merchant_id ?? null,
    isAuthenticated: store.isAuthenticated(),
    login,
    logout,
  }
}
