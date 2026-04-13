'use client'

import { useState, useRef, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CategoryNav } from '@/components/customer/menu/CategoryNav'
import { MenuSection } from '@/components/customer/menu/MenuSection'
import { MenuItemDrawer } from '@/components/customer/menu/MenuItemDrawer'
import { CartButton } from '@/components/customer/cart/CartButton'
import { CartDrawer } from '@/components/customer/cart/CartDrawer'
import { OrderPlacedScreen } from '@/components/customer/order/OrderPlacedScreen'
import { OrderStatusTracker } from '@/components/customer/order/OrderStatusTracker'
import { LoadingPage } from '@/components/common/feedback/LoadingPage'
import { ErrorState } from '@/components/common/feedback/ErrorState'
import { useMenu } from '@/hooks/useMenu'
import { useCart } from '@/hooks/useCart'
import type { MenuItem } from '@/types/menu'
import type { Order } from '@/types/order'
import type { UUID } from '@/types/common'

export default function CustomerMenuPage() {
  const params = useParams()
  const slug = params.slug as string

  const { menu, merchant, categories, isLoading, error, refetch } = useMenu(slug)
  const { itemCount, totalSen, setMerchantSlug } = useCart()

  const [activeCategory, setActiveCategory] = useState<UUID>('')
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null)
  const [trackingOrder, setTrackingOrder] = useState(false)
  const [tableNumber] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('table') ?? '1'
    }
    return '1'
  })

  // Set active category when menu loads
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id)
    }
  }, [categories, activeCategory])

  // Set merchant slug for cart isolation
  useEffect(() => {
    if (slug) setMerchantSlug(slug)
  }, [slug, setMerchantSlug])

  if (isLoading) return <LoadingPage />
  if (error || !menu) return (
    <ErrorState
      message={error?.message ?? 'Failed to load menu'}
      onRetry={refetch}
      className="min-h-screen"
    />
  )

  // Order placed — show confirmation
  if (placedOrder && !trackingOrder) {
    return (
      <div className="min-h-screen bg-background">
        <OrderPlacedScreen
          order={placedOrder}
          onTrackOrder={() => setTrackingOrder(true)}
        />
      </div>
    )
  }

  // Tracking order
  if (placedOrder && trackingOrder) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 border-b bg-background px-4 py-3">
          <h1 className="font-semibold">{merchant?.business_name}</h1>
          <p className="text-xs text-muted-foreground">Table {tableNumber}</p>
        </div>
        <OrderStatusTracker orderId={placedOrder.id} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Merchant header */}
      <div className="px-4 pt-6 pb-4 border-b">
        <h1 className="text-xl font-bold">{merchant?.business_name}</h1>
        <p className="text-sm text-muted-foreground">Table {tableNumber}</p>
      </div>

      {/* Category navigation */}
      <CategoryNav
        categories={categories}
        activeId={activeCategory}
        onSelect={(id) => {
          setActiveCategory(id)
          document.getElementById(`cat-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }}
      />

      {/* Menu sections */}
      <div className="space-y-8 pt-4">
        {categories.map((cat) => (
          <MenuSection
            key={cat.id}
            id={`cat-${cat.id}`}
            category={cat}
            onItemTap={setSelectedItem}
          />
        ))}
      </div>

      {/* Item drawer */}
      <MenuItemDrawer
        item={selectedItem}
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
      />

      {/* Cart button */}
      <CartButton
        itemCount={itemCount}
        totalSen={totalSen}
        onClick={() => setCartOpen(true)}
      />

      {/* Cart drawer */}
      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        merchantSlug={slug}
        sstEnabled={merchant?.sst_enabled ?? false}
        sstRate={merchant?.sst_rate ?? 0}
        tableNumber={tableNumber}
        onOrderPlaced={(order) => {
          setPlacedOrder(order)
          setCartOpen(false)
        }}
      />
    </div>
  )
}
