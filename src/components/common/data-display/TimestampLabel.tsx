'use client'

import { formatDateTime, formatTime, formatDate, timeAgo } from '@/lib/utils/datetime'
import { cn } from '@/lib/utils/cn'

interface TimestampLabelProps {
  utc: string
  format?: 'time' | 'date' | 'datetime' | 'relative'
  className?: string
}

export function TimestampLabel({ utc, format = 'time', className }: TimestampLabelProps) {
  const display =
    format === 'time'     ? formatTime(utc) :
    format === 'date'     ? formatDate(utc) :
    format === 'datetime' ? formatDateTime(utc) :
    timeAgo(utc)

  return (
    <time
      dateTime={utc}
      title={formatDateTime(utc)}
      className={cn('text-sm text-muted-foreground', className)}
    >
      {display}
    </time>
  )
}
