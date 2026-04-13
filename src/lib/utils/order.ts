import type { OrderStatus } from '@/types/order'

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending:   'Pending',
  accepted:  'Accepted',
  preparing: 'Preparing',
  ready:     'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending:   'text-yellow-600 bg-yellow-50 border-yellow-200',
  accepted:  'text-blue-600 bg-blue-50 border-blue-200',
  preparing: 'text-purple-600 bg-purple-50 border-purple-200',
  ready:     'text-green-600 bg-green-50 border-green-200',
  completed: 'text-gray-600 bg-gray-50 border-gray-200',
  cancelled: 'text-red-600 bg-red-50 border-red-200',
}

export const ORDER_STATUS_DOT_COLORS: Record<OrderStatus, string> = {
  pending:   'bg-yellow-500',
  accepted:  'bg-blue-500',
  preparing: 'bg-purple-500',
  ready:     'bg-green-500',
  completed: 'bg-gray-400',
  cancelled: 'bg-red-500',
}

// Valid next transitions per status (strict state machine)
export const ALLOWED_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending:   ['accepted', 'cancelled'],
  accepted:  ['preparing', 'cancelled'],
  preparing: ['ready'],
  ready:     ['completed'],
  completed: [],
  cancelled: [],
}

export function getAllowedTransitions(status: OrderStatus): OrderStatus[] {
  return ALLOWED_TRANSITIONS[status]
}

export function getStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status]
}

export function getStatusColor(status: OrderStatus): string {
  return ORDER_STATUS_COLORS[status]
}

export const ACTIVE_ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready',
]

export const KDS_ORDER_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready',
]

export function isActiveOrder(status: OrderStatus): boolean {
  return ACTIVE_ORDER_STATUSES.includes(status)
}

export function shortOrderId(id: string): string {
  return id.slice(0, 6).toUpperCase()
}
