import { create } from 'zustand'
import type { Order, OrderStatus } from '@/types/order'
import type { UUID } from '@/types/common'
import { KDS_ORDER_STATUSES } from '@/lib/utils/order'

interface KitchenState {
  orders: Order[]
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'

  setOrders(orders: Order[]): void
  upsertOrder(order: Order): void
  removeOrder(orderId: UUID): void
  setConnectionStatus(status: KitchenState['connectionStatus']): void
  ordersByStatus(status: OrderStatus): Order[]
}

export const useKitchenStore = create<KitchenState>()((set, get) => ({
  orders: [],
  connectionStatus: 'disconnected',

  setOrders(orders) {
    // Only keep KDS-relevant statuses, sorted oldest first
    const active = orders
      .filter((o) => KDS_ORDER_STATUSES.includes(o.status))
      .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    set({ orders: active })
  },

  upsertOrder(order) {
    set((state) => {
      // Remove from board if no longer a KDS status
      if (!KDS_ORDER_STATUSES.includes(order.status)) {
        return { orders: state.orders.filter((o) => o.id !== order.id) }
      }
      const exists = state.orders.find((o) => o.id === order.id)
      if (exists) {
        return {
          orders: state.orders
            .map((o) => (o.id === order.id ? order : o))
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()),
        }
      }
      return {
        orders: [...state.orders, order].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ),
      }
    })
  },

  removeOrder(orderId) {
    set((state) => ({ orders: state.orders.filter((o) => o.id !== orderId) }))
  },

  setConnectionStatus(status) {
    set({ connectionStatus: status })
  },

  ordersByStatus(status) {
    return get().orders.filter((o) => o.status === status)
  },
}))
