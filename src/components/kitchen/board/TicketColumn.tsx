'use client'

import { useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { OrderTicket } from '../ticket/OrderTicket'
import { EmptyState } from '@/components/common/feedback/EmptyState'
import { ordersApi } from '@/lib/api/orders'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import type { Order, OrderStatus } from '@/types/order'

const COLUMN_COLORS: Partial<Record<OrderStatus, string>> = {
  pending:   'border-t-yellow-400',
  accepted:  'border-t-blue-400',
  preparing: 'border-t-purple-400',
  ready:     'border-t-green-400',
}

interface TicketColumnProps {
  status: OrderStatus
  label: string
  orders: Order[]
}

export function TicketColumn({ status, label, orders }: TicketColumnProps) {
  const [transitioningId, setTransitioningId] = useState<string | null>(null)

  async function handleTransition(order: Order, nextStatus: OrderStatus) {
    setTransitioningId(order.id)
    try {
      await ordersApi.transitionOrder(order.id, nextStatus)
    } catch {
      toast.error('Failed to update order')
    } finally {
      setTransitioningId(null)
    }
  }

  return (
    <div className={cn(
      'flex flex-col border-t-4 rounded-t-lg bg-muted/30 min-h-0',
      COLUMN_COLORS[status]
    )}>
      {/* Column header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b bg-background/50">
        <span className="font-semibold text-sm">{label}</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-bold">
          {orders.length}
        </span>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3 space-y-3">
          {orders.length === 0 ? (
            <EmptyState title="No orders" className="py-8 text-xs" />
          ) : (
            orders.map((order) => (
              <OrderTicket
                key={order.id}
                order={order}
                onTransition={(next) => handleTransition(order, next)}
                isTransitioning={transitioningId === order.id}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
