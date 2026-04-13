import { cn } from '@/lib/utils/cn'
import { getStatusLabel, ORDER_STATUS_DOT_COLORS } from '@/lib/utils/order'
import type { OrderStatus } from '@/types/order'

interface OrderStatusChipProps {
  status: OrderStatus
  className?: string
}

export function OrderStatusChip({ status, className }: OrderStatusChipProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-sm', className)}>
      <span className={cn('h-2 w-2 rounded-full', ORDER_STATUS_DOT_COLORS[status])} />
      {getStatusLabel(status)}
    </span>
  )
}
