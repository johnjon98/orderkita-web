'use client'

import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import { shortOrderId } from '@/lib/utils/order'
import type { Order } from '@/types/order'

interface OrderPlacedScreenProps {
  order: Order
  onTrackOrder: () => void
}

export function OrderPlacedScreen({ order, onTrackOrder }: OrderPlacedScreenProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-12 px-6 text-center animate-fade-in">
      <div className="rounded-full bg-green-100 p-6">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
      </div>

      <div className="space-y-1">
        <h2 className="text-2xl font-bold">Order placed!</h2>
        <p className="text-muted-foreground text-sm">
          Order #{shortOrderId(order.id)} · Table {order.table_number}
        </p>
      </div>

      <div className="w-full rounded-xl border bg-muted/50 p-4 text-left space-y-2">
        {order.line_items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.quantity}× {item.item_name}</span>
            <PriceDisplay sen={item.line_total_sen} size="sm" />
          </div>
        ))}
        <div className="border-t pt-2 flex justify-between font-semibold">
          <span>Total</span>
          <PriceDisplay sen={order.total_sen} size="sm" />
        </div>
      </div>

      <Button className="w-full h-12 text-base" onClick={onTrackOrder}>
        Track my order
      </Button>
    </div>
  )
}
