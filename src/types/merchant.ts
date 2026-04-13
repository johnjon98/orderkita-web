import type { UUID } from './common'

export type MalaysianState =
  | 'JOHOR'
  | 'KEDAH'
  | 'KELANTAN'
  | 'MELAKA'
  | 'NEGERI_SEMBILAN'
  | 'PAHANG'
  | 'PENANG'
  | 'PERAK'
  | 'PERLIS'
  | 'SABAH'
  | 'SARAWAK'
  | 'SELANGOR'
  | 'TERENGGANU'
  | 'KL'
  | 'LABUAN'
  | 'PUTRAJAYA'

export const MALAYSIAN_STATE_LABELS: Record<MalaysianState, string> = {
  JOHOR: 'Johor',
  KEDAH: 'Kedah',
  KELANTAN: 'Kelantan',
  MELAKA: 'Melaka',
  NEGERI_SEMBILAN: 'Negeri Sembilan',
  PAHANG: 'Pahang',
  PENANG: 'Pulau Pinang',
  PERAK: 'Perak',
  PERLIS: 'Perlis',
  SABAH: 'Sabah',
  SARAWAK: 'Sarawak',
  SELANGOR: 'Selangor',
  TERENGGANU: 'Terengganu',
  KL: 'Kuala Lumpur',
  LABUAN: 'Labuan',
  PUTRAJAYA: 'Putrajaya',
}

export type SubscriptionTier = 'free' | 'growth' | 'chain'

export interface OperatingHours {
  [day: string]: { open: string; close: string } | null
}

export interface Merchant {
  id: UUID
  business_name: string
  slug: string
  address: string
  city: string
  state: MalaysianState
  postcode: string
  operating_hours: OperatingHours
  timezone: string
  sst_enabled: boolean
  sst_rate: number
  subscription_tier: SubscriptionTier
  logo_url: string | null
  logo_placeholder: string | null
  is_active: boolean
  onboarding_completed: boolean
}

export interface Store {
  id: UUID
  merchant: UUID
  name: string
  slug: string
  address: string
  city: string
  state: MalaysianState
  postcode: string
  phone: string
  operating_hours: OperatingHours
  is_active: boolean
}

export interface MerchantSettings {
  sst_enabled: boolean
  sst_rate: number
  operating_hours: OperatingHours
  timezone: string
}
