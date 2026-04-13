'use client'

import { Button } from '@/components/ui/button'
import { getAllowedTransitions, getStatusLabel } from '@/lib/utils/order'
import { LoadingSpinner } from '@/components/common/feedback/LoadingSpinner'
import type { Order, OrderStatus } from '@/types/order'

interface TransitionButtonProps {
  order: Order
  onTransition: (status: OrderStatus) => void
  isLoading: boolean
}

const TRANSITION_VARIANTS: Partial<Record<OrderStatus, 'default' | 'outline' | 'destructive'>> = {
  accepted:  'default',
  preparing: 'default',
  ready:     'default',
  completed: 'outline',
  cancelled: 'destructive',
}

const TRANSITION_LABELS: Partial<Record<OrderStatus, string>> = {
  accepted:  'Accept Order',
  preparing: 'Start Preparing',
  ready:     'Mark Ready',
  completed: 'Complete Order',
  cancelled: 'Cancel',
}

export function TransitionButton({ order, onTransition, isLoading }: TransitionButtonProps) {
  const transitions = getAllowedTransitions(order.status)
  if (transitions.length === 0) return null

  return (
    <div className="flex gap-2 flex-wrap">
      {transitions.map((next) => (
        <Button
          key={next}
          variant={TRANSITION_VARIANTS[next] ?? 'outline'}
          size="sm"
          disabled={isLoading}
          onClick={() => onTransition(next)}
          className="flex items-center gap-2"
        >
          {isLoading && <LoadingSpinner size="sm" />}
          {TRANSITION_LABELS[next] ?? getStatusLabel(next)}
        </Button>
      ))}
    </div>
  )
}
