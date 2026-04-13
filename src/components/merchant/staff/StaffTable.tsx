'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { EmptyState } from '@/components/common/feedback/EmptyState'
import { Trash2 } from 'lucide-react'
import type { User } from '@/types/auth'
import type { UUID } from '@/types/common'

const ROLE_LABELS: Record<string, string> = {
  merchant_staff: 'Counter',
  kitchen_staff:  'Kitchen',
  merchant_owner: 'Owner',
}

interface StaffTableProps {
  staff: User[]
  isLoading: boolean
  onRemove: (userId: UUID) => void
}

export function StaffTable({ staff, isLoading, onRemove }: StaffTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
      </div>
    )
  }

  if (staff.length === 0) {
    return <EmptyState title="No staff members" description="Invite staff to get started" />
  }

  return (
    <div className="space-y-2">
      {staff.map((member) => (
        <div key={member.id} className="flex items-center gap-4 rounded-lg border bg-card px-4 py-3">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">{member.full_name}</p>
            <p className="text-xs text-muted-foreground">{member.email}</p>
          </div>
          <Badge variant="outline">{ROLE_LABELS[member.role] ?? member.role}</Badge>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(member.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  )
}
