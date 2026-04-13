import { cn } from '@/lib/utils/cn'
import { getStatusLabel, getStatusColor } from '@/lib/utils/order'
import type { OrderStatus } from '@/types/order'

interface StatusBadgeProps {
  status: OrderStatus
  size?: 'sm' | 'md'
  className?: string
}

export function StatusBadge({ status, size = 'md', className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        getStatusColor(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
