'use client'

import { useRef } from 'react'
import { cn } from '@/lib/utils/cn'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import type { Category } from '@/types/menu'
import type { UUID } from '@/types/common'

interface CategoryNavProps {
  categories: Category[]
  activeId: UUID
  onSelect: (id: UUID) => void
}

export function CategoryNav({ categories, activeId, onSelect }: CategoryNavProps) {
  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur border-b">
      <ScrollArea className="w-full">
        <div className="flex gap-1 px-4 py-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={cn(
                'flex-shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
                activeId === cat.id
                  ? 'bg-brand text-white'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}
