import axios, { type AxiosInstance, type AxiosError } from 'axios'
import type { ApiError } from '@/types/common'

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'

const ACCESS_TOKEN_KEY = 'ok_access'
const REFRESH_TOKEN_KEY = 'ok_refresh'

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export function setTokens(access: string, refresh: string): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, access)
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh)
}

export function clearTokens(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

const instance: AxiosInstance = axios.create({
  baseURL: `${API_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
})

// Attach access token to every request
instance.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (err: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => {
    if (error) p.reject(error)
    else p.resolve(token!)
  })
  failedQueue = []
}

// Silent token refresh on 401
instance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as typeof error.config & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then((token) => {
          originalRequest.headers!.Authorization = `Bearer ${token}`
          return instance(originalRequest)
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refresh = getRefreshToken()
      if (!refresh) {
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const { data } = await axios.post(`${API_URL}/api/v1/auth/refresh/`, {
          refresh,
        })
        setTokens(data.access, refresh)
        processQueue(null, data.access)
        originalRequest.headers!.Authorization = `Bearer ${data.access}`
        return instance(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearTokens()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Unwrap backend error shape
    const apiError = error.response?.data as ApiError | undefined
    if (apiError?.error) {
      return Promise.reject(apiError.error)
    }
    return Promise.reject(error)
  }
)

export const apiClient = {
  async get<T>(url: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const { data } = await instance.get(url, { params })
    // Unwrap { data: T } envelope
    return (data as { data: T }).data ?? data
  },

  async post<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await instance.post(url, body)
    return (data as { data: T }).data ?? data
  },

  async patch<T>(url: string, body?: unknown): Promise<T> {
    const { data } = await instance.patch(url, body)
    return (data as { data: T }).data ?? data
  },

  async delete<T = void>(url: string): Promise<T> {
    const { data } = await instance.delete(url)
    return data
  },

  // For multipart/form-data (file uploads)
  async postForm<T>(url: string, formData: FormData): Promise<T> {
    const { data } = await instance.post(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return (data as { data: T }).data ?? data
  },
}
