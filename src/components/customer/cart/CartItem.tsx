'use client'

import { Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import type { CartItem as CartItemType } from '@/types/order'
import type { UUID } from '@/types/common'

interface CartItemProps {
  item: CartItemType
  onRemove: (id: UUID) => void
  onQuantityChange: (id: UUID, qty: number) => void
}

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
  const modTotal = item.selected_modifiers.reduce((s, m) => s + m.price_sen, 0)
  const lineTotal = (item.menu_item.price_sen + modTotal) * item.quantity

  return (
    <div className="flex items-start gap-3 py-3">
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{item.menu_item.name}</p>
        {item.selected_modifiers.length > 0 && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {item.selected_modifiers.map((m) => m.name).join(', ')}
          </p>
        )}
        <PriceDisplay sen={lineTotal} size="sm" className="mt-1 text-brand" />
      </div>

      <div className="flex items-center gap-1 flex-shrink-0">
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onQuantityChange(item.menu_item.id, item.quantity - 1)}
        >
          {item.quantity === 1 ? <Trash2 className="h-3 w-3" /> : <Minus className="h-3 w-3" />}
        </Button>
        <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
        <Button
          variant="outline"
          size="icon"
          className="h-7 w-7"
          onClick={() => onQuantityChange(item.menu_item.id, item.quantity + 1)}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}
