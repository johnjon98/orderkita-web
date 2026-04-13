'use client'

import { TicketColumn } from './TicketColumn'
import { useKitchenStore } from '@/stores/kitchenStore'
import type { OrderStatus } from '@/types/order'

const COLUMNS: { status: OrderStatus; label: string }[] = [
  { status: 'pending',   label: 'New Orders' },
  { status: 'accepted',  label: 'Accepted' },
  { status: 'preparing', label: 'Preparing' },
  { status: 'ready',     label: 'Ready' },
]

export function KitchenBoard() {
  const ordersByStatus = useKitchenStore((s) => s.ordersByStatus)

  return (
    <div className="grid grid-cols-4 gap-3 h-full">
      {COLUMNS.map((col) => (
        <TicketColumn
          key={col.status}
          status={col.status}
          label={col.label}
          orders={ordersByStatus(col.status)}
        />
      ))}
    </div>
  )
}
