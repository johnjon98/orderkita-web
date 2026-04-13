import { apiClient } from './base'
import type { AuthTokens, User } from '@/types/auth'

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  email: string
  password: string
  full_name: string
  phone: string
}

export const authApi = {
  login(payload: LoginPayload): Promise<AuthTokens & { user: User }> {
    return apiClient.post('/auth/login/', payload)
  },

  register(payload: RegisterPayload): Promise<{ user: User; tokens: AuthTokens }> {
    return apiClient.post('/auth/register/', payload)
  },

  refresh(refreshToken: string): Promise<{ access: string }> {
    return apiClient.post('/auth/refresh/', { refresh: refreshToken })
  },

  logout(refreshToken: string): Promise<void> {
    return apiClient.post('/auth/logout/', { refresh: refreshToken })
  },

  createCustomerSession(slug: string): Promise<{ session_id: string }> {
    return apiClient.post(`/auth/customer/session/`, { merchant_slug: slug })
  },

  getMe(): Promise<User> {
    return apiClient.get('/users/me/')
  },

  requestPasswordReset(email: string): Promise<void> {
    return apiClient.post('/auth/password-reset/', { email })
  },

  confirmPasswordReset(token: string, password: string): Promise<void> {
    return apiClient.post('/auth/password-reset/confirm/', { token, password })
  },
}
