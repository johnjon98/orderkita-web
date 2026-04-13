'use client'

import { CheckCircle2, Circle, Clock, XCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { LoadingSpinner } from '@/components/common/feedback/LoadingSpinner'
import { useOrderStatus } from '@/hooks/useOrders'
import type { UUID } from '@/types/common'
import type { OrderStatus } from '@/types/order'

const STEPS: { status: OrderStatus; label: string; description: string }[] = [
  { status: 'pending',   label: 'Order received',  description: 'Waiting for merchant to accept' },
  { status: 'accepted',  label: 'Order accepted',  description: 'Your order is confirmed' },
  { status: 'preparing', label: 'Preparing',        description: 'Kitchen is preparing your food' },
  { status: 'ready',     label: 'Ready!',           description: 'Your order is ready to collect' },
]

const STATUS_ORDER: OrderStatus[] = ['pending', 'accepted', 'preparing', 'ready', 'completed']

interface OrderStatusTrackerProps {
  orderId: UUID
}

export function OrderStatusTracker({ orderId }: OrderStatusTrackerProps) {
  const { status, isLoading } = useOrderStatus(orderId)

  if (isLoading || !status) {
    return (
      <div className="flex flex-col items-center gap-4 py-12">
        <LoadingSpinner size="lg" />
        <p className="text-sm text-muted-foreground">Loading order status…</p>
      </div>
    )
  }

  if (status === 'cancelled') {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <XCircle className="h-16 w-16 text-destructive" />
        <p className="font-semibold text-lg">Order Cancelled</p>
        <p className="text-sm text-muted-foreground max-w-xs">
          Your order was cancelled. Please speak to staff for assistance.
        </p>
      </div>
    )
  }

  if (status === 'ready') {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-center animate-fade-in">
        <div className="rounded-full bg-green-100 p-6">
          <CheckCircle2 className="h-16 w-16 text-green-600" />
        </div>
        <p className="font-bold text-2xl text-green-700">Your order is ready!</p>
        <p className="text-sm text-muted-foreground">Please collect your order from the counter.</p>
      </div>
    )
  }

  const currentIndex = STATUS_ORDER.indexOf(status)

  return (
    <div className="space-y-6 py-6 px-4">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">Tracking your order</p>
        <p className="font-bold text-lg mt-1">
          {STEPS.find((s) => s.status === status)?.description}
        </p>
      </div>

      <div className="space-y-0">
        {STEPS.map((step, idx) => {
          const stepIndex = STATUS_ORDER.indexOf(step.status)
          const isDone = stepIndex < currentIndex
          const isCurrent = step.status === status

          return (
            <div key={step.status} className="flex items-start gap-3">
              {/* Icon + line */}
              <div className="flex flex-col items-center">
                <div className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all',
                  isDone    ? 'border-green-500 bg-green-500 text-white' :
                  isCurrent ? 'border-brand bg-brand text-white' :
                              'border-muted-foreground/30 bg-background text-muted-foreground/30'
                )}>
                  {isDone ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : isCurrent ? (
                    <Clock className="h-4 w-4 animate-pulse" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={cn(
                    'w-0.5 h-8 transition-colors',
                    isDone ? 'bg-green-500' : 'bg-muted'
                  )} />
                )}
              </div>

              {/* Text */}
              <div className="pt-1 pb-8">
                <p className={cn(
                  'text-sm font-medium',
                  isCurrent ? 'text-foreground' : isDone ? 'text-green-600' : 'text-muted-foreground'
                )}>
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
