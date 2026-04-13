import { apiClient } from './base'
import type { Order } from '@/types/order'

export const kitchenApi = {
  listKitchenOrders(): Promise<Order[]> {
    return apiClient.get('/kitchen/orders/')
  },
}
