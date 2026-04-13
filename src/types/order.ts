import type { UUID } from './common'
import type { MenuItem, Modifier } from './menu'

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
  item_name: string
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

export interface PlaceOrderPayload {
  table_number: string
  notes?: string
  items: {
    menu_item_id: UUID
    quantity: number
    modifier_ids: UUID[]
  }[]
}

export interface TransitionOrderPayload {
  status: OrderStatus
  reason?: string
}

// Client-side only — not from API
export interface CartItem {
  menu_item: MenuItem
  quantity: number
  selected_modifiers: Modifier[]
}
