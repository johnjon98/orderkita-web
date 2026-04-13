'use client'

import { cn } from '@/lib/utils/cn'
import { useKitchenStore } from '@/stores/kitchenStore'

export function ConnectionStatus() {
  const status = useKitchenStore((s) => s.connectionStatus)

  const config = {
    connecting:   { dot: 'bg-yellow-400 animate-pulse', label: 'Connecting…' },
    connected:    { dot: 'bg-green-400',                label: 'Live' },
    disconnected: { dot: 'bg-red-400 animate-pulse',    label: 'Disconnected' },
    error:        { dot: 'bg-red-500',                  label: 'Error' },
  }[status]

  return (
    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
      <span className={cn('h-2 w-2 rounded-full', config.dot)} />
      {config.label}
    </span>
  )
}
