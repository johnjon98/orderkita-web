'use client'

import { MenuItemCard } from './MenuItemCard'
import type { MenuCategory, MenuItem } from '@/types/menu'

interface MenuSectionProps {
  category: MenuCategory
  id: string
  onItemTap: (item: MenuItem) => void
}

export function MenuSection({ category, id, onItemTap }: MenuSectionProps) {
  const availableItems = category.items.filter((item) => item.is_available || true) // show all, card handles unavailable state

  if (availableItems.length === 0) return null

  return (
    <section id={id} className="scroll-mt-24 space-y-3">
      <h2 className="px-4 text-base font-bold">{category.name}</h2>
      <div className="space-y-2 px-4">
        {availableItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onTap={onItemTap} />
        ))}
      </div>
    </section>
  )
}
