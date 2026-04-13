# Phase 02 — TypeScript Types

## Goal
Define all TypeScript types that mirror the backend Django models. These are the source of truth for every API call, component prop, and store shape.

## Files to Create

### `src/types/common.ts`
```ts
export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    page: number
    page_size: number
    total_count: number
    total_pages: number
  }
}

export interface ApiResponse<T> {
  data: T
}

export interface ApiError {
  error: {
    code: string
    message: string
  }
}

export type UUID = string
```

### `src/types/auth.ts`
```ts
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
}

export interface AuthTokens {
  access: string
  refresh: string
}
```

### `src/types/merchant.ts`
```ts
export type MalaysianState =
  | 'JOHOR' | 'KEDAH' | 'KELANTAN' | 'MELAKA'
  | 'NEGERI_SEMBILAN' | 'PAHANG' | 'PENANG'
  | 'PERAK' | 'PERLIS' | 'SABAH' | 'SARAWAK'
  | 'SELANGOR' | 'TERENGGANU' | 'KL' | 'LABUAN' | 'PUTRAJAYA'

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
  sst_rate: number           // basis points e.g. 600 = 6%
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
```

### `src/types/menu.ts`
```ts
export interface Category {
  id: UUID
  merchant: UUID
  store: UUID | null
  name: string
  display_order: number
  is_active: boolean
}

export interface Modifier {
  id: UUID
  modifier_group: UUID
  name: string
  price_sen: number          // 0 = no charge
  is_available: boolean
}

export interface ModifierGroup {
  id: UUID
  menu_item: UUID
  name: string
  is_required: boolean
  min_select: number
  max_select: number
  modifiers: Modifier[]
}

export interface MenuItem {
  id: UUID
  category: UUID
  merchant: UUID
  name: string
  description: string
  price_sen: number          // always integer, never float
  is_available: boolean
  display_order: number
  image_url: string | null
  image_placeholder: string | null
  preparation_time_minutes: number
  modifier_groups: ModifierGroup[]
}

export interface MenuCategory extends Category {
  items: MenuItem[]
}

export interface PublicMenu {
  merchant: Merchant
  categories: MenuCategory[]
}
```

### `src/types/order.ts`
```ts
export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'preparing'
  | 'ready'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'captured' | 'refunded' | 'failed'

export interface SelectedModifier {
  id: UUID
  name: string
  price_sen: number
}

export interface OrderLineItem {
  id: UUID
  menu_item: UUID | null
  item_name: string          // denormalized snapshot
  unit_price_sen: number
  quantity: number
  modifiers: SelectedModifier[]
  line_total_sen: number
}

export interface OrderStatusLog {
  id: UUID
  from_status: OrderStatus | null
  to_status: OrderStatus
  actor_label: string
  reason: string
  created_at: string
}

export interface Order {
  id: UUID
  merchant: UUID
  store: UUID | null
  table_number: string
  status: OrderStatus
  subtotal_sen: number
  sst_sen: number
  total_sen: number
  notes: string
  payment_status: PaymentStatus
  line_items: OrderLineItem[]
  status_logs: OrderStatusLog[]
  created_at: string
  updated_at: string
}

// Used when placing an order (POST /orders/<slug>/)
export interface PlaceOrderPayload {
  table_number: string
  notes?: string
  items: {
    menu_item_id: UUID
    quantity: number
    modifier_ids: UUID[]
  }[]
}

// Cart item (client-side only, not from API)
export interface CartItem {
  menu_item: MenuItem
  quantity: number
  selected_modifiers: Modifier[]
}
```

## Done When
- All type files exist under `src/types/`
- No `any` types — everything is explicitly typed
- Types match backend model field names exactly (snake_case)
