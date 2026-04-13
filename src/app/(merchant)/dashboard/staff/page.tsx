'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { SectionHeader } from '@/components/common/layout/SectionHeader'
import { StaffTable } from '@/components/merchant/staff/StaffTable'
import { InviteStaffForm } from '@/components/merchant/staff/InviteStaffForm'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { merchantsApi } from '@/lib/api/merchants'
import { toast } from 'sonner'
import type { UUID } from '@/types/common'

export default function StaffPage() {
  const [inviteOpen, setInviteOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: staff = [], isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: () => merchantsApi.listStaff(),
  })

  async function handleRemove(userId: UUID) {
    toast.info('Contact support to remove staff members')
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Staff"
        subtitle={`${staff.length} member${staff.length !== 1 ? 's' : ''}`}
        action={
          <Button onClick={() => setInviteOpen(true)}>
            <Plus className="h-4 w-4 mr-1" /> Invite staff
          </Button>
        }
      />

      <StaffTable staff={staff} isLoading={isLoading} onRemove={handleRemove} />

      <Sheet open={inviteOpen} onOpenChange={setInviteOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Invite staff member</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            <InviteStaffForm
              onSuccess={() => {
                setInviteOpen(false)
                queryClient.invalidateQueries({ queryKey: ['staff'] })
              }}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
