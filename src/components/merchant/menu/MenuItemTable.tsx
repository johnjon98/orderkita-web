'use client'

import Image from 'next/image'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Skeleton } from '@/components/ui/skeleton'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import { EmptyState } from '@/components/common/feedback/EmptyState'
import { menusApi } from '@/lib/api/menus'
import { toast } from 'sonner'
import type { MenuItem } from '@/types/menu'

interface MenuItemTableProps {
  items: MenuItem[]
  isLoading: boolean
  onEdit: (item: MenuItem) => void
  onDelete: (item: MenuItem) => void
  onRefresh: () => void
}

export function MenuItemTable({ items, isLoading, onEdit, onDelete, onRefresh }: MenuItemTableProps) {
  async function toggleAvailability(item: MenuItem) {
    try {
      await menusApi.updateMenuItem(item.id, { is_available: !item.is_available })
      onRefresh()
    } catch {
      toast.error('Failed to update item')
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
      </div>
    )
  }

  if (items.length === 0) {
    return <EmptyState title="No menu items" description="Add your first item to get started" />
  }

  return (
    <div className="space-y-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
          {/* Thumbnail */}
          <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-muted">
            {item.image_url ? (
              <Image src={item.image_url} alt={item.name} fill className="object-cover"
                placeholder={item.image_placeholder ? 'blur' : 'empty'}
                blurDataURL={item.image_placeholder ?? undefined}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-lg">🍽️</div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm truncate">{item.name}</p>
            <PriceDisplay sen={item.price_sen} size="sm" className="text-muted-foreground" />
          </div>

          <Switch
            checked={item.is_available}
            onCheckedChange={() => toggleAvailability(item)}
            title={item.is_available ? 'Available' : 'Unavailable'}
          />

          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(item)}>
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => onDelete(item)}>
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
