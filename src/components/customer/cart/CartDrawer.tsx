'use client'

import { useState } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { CartItem } from './CartItem'
import { CartSummary } from './CartSummary'
import { EmptyState } from '@/components/common/feedback/EmptyState'
import { SubmitButton } from '@/components/common/forms/SubmitButton'
import { useCart } from '@/hooks/useCart'
import { ordersApi } from '@/lib/api/orders'
import { toast } from 'sonner'
import type { Order } from '@/types/order'

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  merchantSlug: string
  sstEnabled: boolean
  sstRate: number
  tableNumber: string
  onOrderPlaced: (order: Order) => void
}

export function CartDrawer({
  open,
  onClose,
  merchantSlug,
  sstEnabled,
  sstRate,
  tableNumber,
  onOrderPlaced,
}: CartDrawerProps) {
  const { items, removeItem, updateQuantity, clearCart, totalSen } = useCart()
  const [notes, setNotes] = useState('')
  const [isPlacing, setIsPlacing] = useState(false)

  const sstSen = sstEnabled ? Math.round(totalSen * sstRate / 10000) : 0
  const grandTotal = totalSen + sstSen

  async function handlePlaceOrder() {
    setIsPlacing(true)
    try {
      const order = await ordersApi.placeOrder(merchantSlug, {
        table_number: tableNumber,
        notes: notes || undefined,
        items: items.map((i) => ({
          menu_item_id: i.menu_item.id,
          quantity: i.quantity,
          modifier_ids: i.selected_modifiers.map((m) => m.id),
        })),
      })
      clearCart()
      onClose()
      onOrderPlaced(order)
    } catch {
      toast.error('Failed to place order. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="bottom" className="h-[90dvh] flex flex-col p-0">
        <SheetHeader className="px-4 pt-4 pb-2">
          <SheetTitle>Your order · Table {tableNumber}</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Add items from the menu to get started"
            className="flex-1"
          />
        ) : (
          <>
            <ScrollArea className="flex-1 overflow-y-auto px-4">
              <div className="divide-y">
                {items.map((item) => (
                  <CartItem
                    key={item.menu_item.id}
                    item={item}
                    onRemove={removeItem}
                    onQuantityChange={updateQuantity}
                  />
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <label className="text-sm font-medium">Special requests</label>
                <Input
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any allergies or special requests?"
                />
              </div>
            </ScrollArea>

            <div className="border-t p-4 space-y-4 bg-background">
              <CartSummary subtotalSen={totalSen} sstSen={sstSen} totalSen={grandTotal} />
              <SubmitButton
                isLoading={isPlacing}
                label="Place order"
                loadingLabel="Placing order…"
                className="w-full h-12 text-base"
                onClick={handlePlaceOrder}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}
