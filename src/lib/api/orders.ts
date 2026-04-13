import { apiClient } from './base'
import type { Order, OrderStatus, PlaceOrderPayload } from '@/types/order'
import type { PaginatedResponse, UUID } from '@/types/common'

export interface ListOrdersParams {
  status?: OrderStatus
  page?: number
  page_size?: number
}

export const ordersApi = {
  placeOrder(slug: string, payload: PlaceOrderPayload): Promise<Order> {
    return apiClient.post(`/orders/${slug}/`, payload)
  },

  getOrderStatus(id: UUID): Promise<{ status: OrderStatus }> {
    return apiClient.get(`/orders/${id}/status/`)
  },

  listOrders(params?: ListOrdersParams): Promise<PaginatedResponse<Order>> {
    return apiClient.get('/orders/', params as Record<string, string | number | boolean>)
  },

  getOrder(id: UUID): Promise<Order> {
    return apiClient.get(`/orders/${id}/`)
  },

  transitionOrder(id: UUID, status: OrderStatus, reason?: string): Promise<Order> {
    return apiClient.post(`/orders/${id}/transition/`, { status, reason })
  },
}
