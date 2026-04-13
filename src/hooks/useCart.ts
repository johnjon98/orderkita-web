'use client'

import { useCartStore } from '@/stores/cartStore'

export function useCart() {
  const store = useCartStore()

  return {
    items: store.items,
    merchantSlug: store.merchantSlug,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
    setMerchantSlug: store.setMerchantSlug,
    totalSen: store.totalSen(),
    itemCount: store.itemCount(),
  }
}
