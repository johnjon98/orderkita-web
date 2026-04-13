import { cn } from '@/lib/utils/cn'
import { formatPrice } from '@/lib/utils/currency'

interface PriceDisplayProps {
  sen: number
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl font-bold',
}

export function PriceDisplay({ sen, label, className, size = 'md' }: PriceDisplayProps) {
  if (sen === 0 && label) {
    return (
      <span className={cn('text-muted-foreground', sizeClasses[size], className)}>
        {label}
      </span>
    )
  }

  return (
    <span className={cn('font-medium tabular-nums', sizeClasses[size], className)}>
      {formatPrice(sen)}
    </span>
  )
}
