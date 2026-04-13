'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils/cn'
import { elapsedMinutes, formatElapsed } from '@/lib/utils/datetime'

interface TicketAgeProps {
  createdAt: string
  className?: string
}

export function TicketAge({ createdAt, className }: TicketAgeProps) {
  const [mins, setMins] = useState(() => elapsedMinutes(createdAt))

  useEffect(() => {
    const interval = setInterval(() => {
      setMins(elapsedMinutes(createdAt))
    }, 60_000)
    return () => clearInterval(interval)
  }, [createdAt])

  return (
    <span
      className={cn(
        'text-xs font-medium tabular-nums',
        mins >= 10 ? 'text-red-500' : mins >= 5 ? 'text-amber-500' : 'text-muted-foreground',
        className
      )}
    >
      {formatElapsed(createdAt)}
    </span>
  )
}
