'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SectionHeader } from '@/components/common/layout/SectionHeader'
import { MenuItemTable } from '@/components/merchant/menu/MenuItemTable'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { menusApi } from '@/lib/api/menus'
import { toast } from 'sonner'
import type { MenuItem } from '@/types/menu'

export default function MenuPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['menu-items'],
    queryFn: () => menusApi.listMenuItems(),
  })

  async function handleDelete(item: MenuItem) {
    if (!confirm(`Delete "${item.name}"?`)) return
    try {
      await menusApi.deleteMenuItem(item.id)
      queryClient.invalidateQueries({ queryKey: ['menu-items'] })
      toast.success('Item deleted')
    } catch {
      toast.error('Failed to delete item')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Menu"
        action={
          <Button onClick={() => router.push('/dashboard/menu/items/new')}>
            <Plus className="h-4 w-4 mr-1" /> Add item
          </Button>
        }
      />

      <MenuItemTable
        items={data?.data ?? []}
        isLoading={isLoading}
        onEdit={(item) => router.push(`/dashboard/menu/items/${item.id}`)}
        onDelete={handleDelete}
        onRefresh={() => queryClient.invalidateQueries({ queryKey: ['menu-items'] })}
      />
    </div>
  )
}
