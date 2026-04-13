import { apiClient } from './base'
import type { Merchant, MerchantSettings, Store } from '@/types/merchant'
import type { User } from '@/types/auth'
import type { UUID } from '@/types/common'

export interface UpdateMerchantPayload {
  business_name?: string
  address?: string
  city?: string
  state?: string
  postcode?: string
}

export interface CreateStorePayload {
  name: string
  address: string
  city: string
  state: string
  postcode: string
  phone: string
}

export interface InviteStaffPayload {
  email: string
  full_name: string
  role: 'merchant_staff' | 'kitchen_staff'
}

export const merchantsApi = {
  getMerchantPublic(slug: string): Promise<Merchant> {
    return apiClient.get(`/merchants/${slug}/`)
  },

  getMerchantMe(): Promise<Merchant> {
    return apiClient.get('/merchants/me/')
  },

  updateMerchantMe(payload: UpdateMerchantPayload): Promise<Merchant> {
    return apiClient.patch('/merchants/me/', payload)
  },

  getMerchantSettings(): Promise<MerchantSettings> {
    return apiClient.get('/merchants/me/settings/')
  },

  updateMerchantSettings(payload: Partial<MerchantSettings>): Promise<MerchantSettings> {
    return apiClient.patch('/merchants/me/settings/', payload)
  },

  listStores(): Promise<Store[]> {
    return apiClient.get('/merchants/me/stores/')
  },

  createStore(payload: CreateStorePayload): Promise<Store> {
    return apiClient.post('/merchants/me/stores/', payload)
  },

  updateStore(id: UUID, payload: Partial<CreateStorePayload>): Promise<Store> {
    return apiClient.patch(`/merchants/me/stores/${id}/`, payload)
  },

  deleteStore(id: UUID): Promise<void> {
    return apiClient.delete(`/merchants/me/stores/${id}/`)
  },

  listStaff(): Promise<User[]> {
    return apiClient.get('/users/staff/')
  },

  inviteStaff(payload: InviteStaffPayload): Promise<User> {
    return apiClient.post('/users/staff/invite/', payload)
  },
}
