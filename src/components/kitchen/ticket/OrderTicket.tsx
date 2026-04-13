'use client'

import { cn } from '@/lib/utils/cn'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { TicketLineItem } from './TicketLineItem'
import { TicketAge } from './TicketAge'
import { LoadingSpinner } from '@/components/common/feedback/LoadingSpinner'
import { getAllowedTransitions, getStatusLabel, shortOrderId } from '@/lib/utils/order'
import type { Order, OrderStatus } from '@/types/order'

const TICKET_BORDER: Partial<Record<OrderStatus, string>> = {
  pending:   'border-l-yellow-400',
  accepted:  'border-l-blue-400',
  preparing: 'border-l-purple-400',
  ready:     'border-l-green-400',
}

const NEXT_LABEL: Partial<Record<OrderStatus, string>> = {
  accepted:  'Accept',
  preparing: 'Preparing',
  ready:     'Ready',
  completed: 'Done',
}

interface OrderTicketProps {
  order: Order
  onTransition: (status: OrderStatus) => void
  isTransitioning: boolean
}

export function OrderTicket({ order, onTransition, isTransitioning }: OrderTicketProps) {
  const transitions = getAllowedTransitions(order.status).filter((s) => s !== 'cancelled')

  return (
    <div className={cn(
      'rounded-xl border-l-4 bg-card shadow-sm p-4 space-y-3 animate-fade-in',
      TICKET_BORDER[order.status] ?? 'border-l-muted'
    )}>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="font-bold text-lg font-mono">#{shortOrderId(order.id)}</span>
          <span className="ml-2 text-sm text-muted-foreground">Table {order.table_number}</span>
        </div>
        <TicketAge createdAt={order.created_at} />
      </div>

      <Separator />

      {/* Items */}
      <div className="space-y-2.5">
        {order.line_items.map((item) => (
          <TicketLineItem key={item.id} lineItem={item} />
        ))}
      </div>

      {/* Notes */}
      {order.notes && (
        <>
          <Separator />
          <p className="text-xs text-muted-foreground italic">&ldquo;{order.notes}&rdquo;</p>
        </>
      )}

      {/* Actions */}
      {transitions.length > 0 && (
        <>
          <Separator />
          <div className="flex gap-2">
            {transitions.map((next) => (
              <Button
                key={next}
                size="sm"
                className="flex-1 font-semibold"
                disabled={isTransitioning}
                onClick={() => onTransition(next)}
              >
                {isTransitioning ? <LoadingSpinner size="sm" /> : (NEXT_LABEL[next] ?? getStatusLabel(next))}
              </Button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
