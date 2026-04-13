import type { UUID } from './common'

export type UserRole =
  | 'customer'
  | 'merchant_owner'
  | 'merchant_staff'
  | 'kitchen_staff'
  | 'admin'
  | 'superadmin'

export interface User {
  id: UUID
  email: string
  phone: string
  full_name: string
  role: UserRole
  is_active: boolean
  created_at: string
}

export interface JWTClaims {
  user_id: UUID
  role: UserRole
  merchant_id: UUID | null
  exp: number
}

export interface AuthTokens {
  access: string
  refresh: string
}
