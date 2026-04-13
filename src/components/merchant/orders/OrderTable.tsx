'use client'

import { useState } from 'react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Skeleton } from '@/components/ui/skeleton'
import { StatusBadge } from '@/components/common/data-display/StatusBadge'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import { TimestampLabel } from '@/components/common/data-display/TimestampLabel'
import { EmptyState } from '@/components/common/feedback/EmptyState'
import { shortOrderId } from '@/lib/utils/order'
import { cn } from '@/lib/utils/cn'
import type { Order, OrderStatus } from '@/types/order'

const STATUS_TABS: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all',       label: 'All' },
  { value: 'pending',   label: 'Pending' },
  { value: 'accepted',  label: 'Accepted' },
  { value: 'preparing', label: 'Preparing' },
  { value: 'ready',     label: 'Ready' },
  { value: 'completed', label: 'Completed' },
]

interface OrderTableProps {
  orders: Order[]
  isLoading: boolean
  onSelect: (order: Order) => void
}

export function OrderTable({ orders, isLoading, onSelect }: OrderTableProps) {
  const [tab, setTab] = useState<OrderStatus | 'all'>('all')

  const filtered = tab === 'all' ? orders : orders.filter((o) => o.status === tab)

  return (
    <div className="space-y-4">
      <Tabs value={tab} onValueChange={(v) => setTab(v as OrderStatus | 'all')}>
        <TabsList className="flex-wrap h-auto gap-1 bg-transparent p-0">
          {STATUS_TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="data-[state=active]:bg-brand data-[state=active]:text-white rounded-full px-3 py-1 text-xs border"
            >
              {t.label}
              {t.value !== 'all' && (
                <span className="ml-1.5 text-[10px] opacity-70">
                  {orders.filter((o) => o.status === t.value).length}
                </span>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No orders" description="Orders will appear here" />
      ) : (
        <div className="space-y-2">
          {filtered.map((order) => (
            <button
              key={order.id}
              onClick={() => onSelect(order)}
              className={cn(
                'w-full flex items-center gap-4 rounded-lg border bg-card p-4 text-left transition-all hover:shadow-sm hover:border-brand/30 active:scale-[0.99]'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-semibold text-sm">#{shortOrderId(order.id)}</span>
                  <span className="text-muted-foreground text-sm">Table {order.table_number}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {order.line_items.length} item{order.line_items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={order.status} size="sm" />
                <PriceDisplay sen={order.total_sen} size="sm" />
              </div>
              <TimestampLabel utc={order.created_at} format="relative" className="text-xs hidden sm:block" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
