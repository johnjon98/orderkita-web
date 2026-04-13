'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { ordersApi, type ListOrdersParams } from '@/lib/api/orders'
import type { OrderStatus } from '@/types/order'
import type { UUID } from '@/types/common'

export function useOrders(params?: ListOrdersParams) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.listOrders(params),
    refetchInterval: 30_000, // auto-refresh every 30s
  })

  return {
    orders: data?.data ?? [],
    meta: data?.meta ?? null,
    isLoading,
    error: error as Error | null,
    refetch,
  }
}

export function useOrder(id: UUID) {
  const queryClient = useQueryClient()

  const { data: order, isLoading, error } = useQuery({
    queryKey: ['order', id],
    queryFn: () => ordersApi.getOrder(id),
    enabled: !!id,
  })

  const { mutateAsync: transition, isPending: isTransitioning } = useMutation({
    mutationFn: ({ status, reason }: { status: OrderStatus; reason?: string }) =>
      ordersApi.transitionOrder(id, status, reason),
    onSuccess: (updated) => {
      queryClient.setQueryData(['order', id], updated)
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })

  return {
    order: order ?? null,
    isLoading,
    error: error as Error | null,
    transition,
    isTransitioning,
  }
}

export function useOrderStatus(id: UUID) {
  const { data, isLoading } = useQuery({
    queryKey: ['order-status', id],
    queryFn: () => ordersApi.getOrderStatus(id),
    refetchInterval: (query) => {
      const status = query.state.data?.status
      if (!status) return 5_000
      if (status === 'completed' || status === 'cancelled') return false
      return 5_000
    },
    enabled: !!id,
  })

  return {
    status: data?.status ?? null,
    isLoading,
  }
}
