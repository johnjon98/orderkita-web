import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '@/types/order'
import type { UUID } from '@/types/common'
import type { Modifier } from '@/types/menu'

interface CartState {
  items: CartItem[]
  merchantSlug: string | null

  addItem(item: CartItem): void
  removeItem(menuItemId: UUID): void
  updateQuantity(menuItemId: UUID, qty: number): void
  clearCart(): void
  setMerchantSlug(slug: string): void
  totalSen(): number
  itemCount(): number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      merchantSlug: null,

      addItem(newItem) {
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.menu_item.id === newItem.menu_item.id &&
              sameModifiers(i.selected_modifiers, newItem.selected_modifiers)
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i === existing ? { ...i, quantity: i.quantity + newItem.quantity } : i
              ),
            }
          }
          return { items: [...state.items, newItem] }
        })
      },

      removeItem(menuItemId) {
        set((state) => ({
          items: state.items.filter((i) => i.menu_item.id !== menuItemId),
        }))
      },

      updateQuantity(menuItemId, qty) {
        if (qty <= 0) {
          get().removeItem(menuItemId)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.menu_item.id === menuItemId ? { ...i, quantity: qty } : i
          ),
        }))
      },

      clearCart() {
        set({ items: [], merchantSlug: null })
      },

      setMerchantSlug(slug) {
        // Clear cart if switching to a different merchant
        set((state) => {
          if (state.merchantSlug && state.merchantSlug !== slug) {
            return { items: [], merchantSlug: slug }
          }
          return { merchantSlug: slug }
        })
      },

      totalSen() {
        return get().items.reduce((sum, item) => {
          const modTotal = item.selected_modifiers.reduce(
            (s, m) => s + m.price_sen,
            0
          )
          return sum + (item.menu_item.price_sen + modTotal) * item.quantity
        }, 0)
      },

      itemCount() {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    { name: 'ok-cart' }
  )
)

function sameModifiers(a: Modifier[], b: Modifier[]): boolean {
  if (a.length !== b.length) return false
  const aIds = [...a.map((m) => m.id)].sort()
  const bIds = [...b.map((m) => m.id)].sort()
  return aIds.every((id, i) => id === bIds[i])
}
