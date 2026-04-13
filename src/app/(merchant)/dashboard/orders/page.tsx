'use client'

import { useState } from 'react'
import { SectionHeader } from '@/components/common/layout/SectionHeader'
import { OrderTable } from '@/components/merchant/orders/OrderTable'
import { OrderDetailPanel } from '@/components/merchant/orders/OrderDetailPanel'
import { useOrders } from '@/hooks/useOrders'
import type { Order } from '@/types/order'

export default function OrdersPage() {
  const { orders, isLoading, refetch } = useOrders()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Orders"
        subtitle="Auto-refreshes every 30 seconds"
      />

      <OrderTable
        orders={orders}
        isLoading={isLoading}
        onSelect={(order: Order) => setSelectedOrderId(order.id)}
      />

      <OrderDetailPanel
        orderId={selectedOrderId}
        open={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
      />
    </div>
  )
}
