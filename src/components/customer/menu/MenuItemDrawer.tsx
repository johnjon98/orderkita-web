'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Minus, Plus } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import { ModifierSelector } from './ModifierSelector'
import { useCart } from '@/hooks/useCart'
import { formatPrice } from '@/lib/utils/currency'
import type { MenuItem, Modifier } from '@/types/menu'
import type { UUID } from '@/types/common'

interface MenuItemDrawerProps {
  item: MenuItem | null
  open: boolean
  onClose: () => void
}

export function MenuItemDrawer({ item, open, onClose }: MenuItemDrawerProps) {
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedMods, setSelectedMods] = useState<Record<UUID, UUID[]>>({})

  if (!item) return null

  const requiredGroups = item.modifier_groups.filter((g) => g.is_required)
  const allRequiredFulfilled = requiredGroups.every(
    (g) => (selectedMods[g.id]?.length ?? 0) >= g.min_select
  )

  const flatSelectedMods: Modifier[] = item.modifier_groups.flatMap((g) =>
    (selectedMods[g.id] ?? []).flatMap(
      (id) => g.modifiers.filter((m) => m.id === id)
    )
  )

  const modTotal = flatSelectedMods.reduce((sum, m) => sum + m.price_sen, 0)
  const lineTotal = (item.price_sen + modTotal) * quantity

  function handleAdd() {
    addItem({ menu_item: item!, quantity, selected_modifiers: flatSelectedMods })
    onClose()
    setQuantity(1)
    setSelectedMods({})
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[90dvh] flex flex-col p-0">
        {/* Image */}
        {item.image_url && (
          <div className="relative h-48 w-full flex-shrink-0 bg-muted">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
              placeholder={item.image_placeholder ? 'blur' : 'empty'}
              blurDataURL={item.image_placeholder ?? undefined}
            />
          </div>
        )}

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-5">
            <SheetHeader className="text-left space-y-1">
              <SheetTitle className="text-xl">{item.name}</SheetTitle>
              {item.description && (
                <p className="text-sm text-muted-foreground">{item.description}</p>
              )}
              <PriceDisplay sen={item.price_sen} size="lg" className="text-brand" />
            </SheetHeader>

            {item.modifier_groups.length > 0 && (
              <>
                <Separator />
                <div className="space-y-5">
                  {item.modifier_groups.map((group) => (
                    <ModifierSelector
                      key={group.id}
                      group={group}
                      selected={selectedMods[group.id] ?? []}
                      onChange={(ids) => setSelectedMods((prev) => ({ ...prev, [group.id]: ids }))}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t bg-background p-4 space-y-3">
          {/* Quantity */}
          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setQuantity((q) => q + 1)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            className="w-full h-12 text-base"
            onClick={handleAdd}
            disabled={!allRequiredFulfilled}
          >
            Add to cart · {formatPrice(lineTotal)}
          </Button>

          {!allRequiredFulfilled && (
            <p className="text-xs text-center text-muted-foreground">
              Please make all required selections
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
