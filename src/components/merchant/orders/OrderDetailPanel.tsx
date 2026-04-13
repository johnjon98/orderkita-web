'use client'

import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { StatusBadge } from '@/components/common/data-display/StatusBadge'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import { TimestampLabel } from '@/components/common/data-display/TimestampLabel'
import { TransitionButton } from './TransitionButton'
import { useOrder } from '@/hooks/useOrders'
import { shortOrderId } from '@/lib/utils/order'
import { getStatusLabel } from '@/lib/utils/order'
import { toast } from 'sonner'
import type { Order, OrderStatus } from '@/types/order'

interface OrderDetailPanelProps {
  orderId: string | null
  open: boolean
  onClose: () => void
}

export function OrderDetailPanel({ orderId, open, onClose }: OrderDetailPanelProps) {
  const { order, transition, isTransitioning } = useOrder(orderId ?? '')

  async function handleTransition(status: OrderStatus) {
    try {
      await transition({ status })
      toast.success(`Order ${getStatusLabel(status).toLowerCase()}`)
    } catch {
      toast.error('Failed to update order status')
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-md flex flex-col p-0">
        {order ? (
          <>
            <SheetHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <SheetTitle>Order #{shortOrderId(order.id)}</SheetTitle>
                <StatusBadge status={order.status} />
              </div>
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>Table {order.table_number}</span>
                <TimestampLabel utc={order.created_at} format="time" />
              </div>
            </SheetHeader>

            <ScrollArea className="flex-1">
              <div className="px-6 py-4 space-y-5">
                {/* Line items */}
                <div className="space-y-3">
                  {order.line_items.map((item) => (
                    <div key={item.id}>
                      <div className="flex justify-between text-sm font-medium">
                        <span>{item.quantity}× {item.item_name}</span>
                        <PriceDisplay sen={item.line_total_sen} size="sm" />
                      </div>
                      {item.modifiers.length > 0 && (
                        <ul className="mt-0.5 space-y-0.5 pl-4">
                          {item.modifiers.map((m) => (
                            <li key={m.id} className="text-xs text-muted-foreground">
                              + {m.name}
                              {m.price_sen > 0 && <span className="ml-1 text-muted-foreground/70">(+RM {(m.price_sen / 100).toFixed(2)})</span>}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Totals */}
                <div className="space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <PriceDisplay sen={order.subtotal_sen} size="sm" />
                  </div>
                  {order.sst_sen > 0 && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SST</span>
                      <PriceDisplay sen={order.sst_sen} size="sm" />
                    </div>
                  )}
                  <div className="flex justify-between font-semibold pt-1">
                    <span>Total</span>
                    <PriceDisplay sen={order.total_sen} size="sm" />
                  </div>
                </div>

                {order.notes && (
                  <>
                    <Separator />
                    <div>
                      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                      <p className="text-sm">{order.notes}</p>
                    </div>
                  </>
                )}

                <Separator />

                {/* Status history */}
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">History</p>
                  <div className="space-y-2">
                    {order.status_logs.map((log) => (
                      <div key={log.id} className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{getStatusLabel(log.to_status)}</span>
                        <TimestampLabel utc={log.created_at} format="time" className="text-xs" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </ScrollArea>

            {/* Actions */}
            <div className="border-t px-6 py-4">
              <TransitionButton
                order={order}
                onTransition={handleTransition}
                isLoading={isTransitioning}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Loading…
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
