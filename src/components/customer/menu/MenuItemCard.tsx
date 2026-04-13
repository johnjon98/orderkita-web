'use client'

import Image from 'next/image'
import { ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'
import type { MenuItem } from '@/types/menu'

interface MenuItemCardProps {
  item: MenuItem
  onTap: (item: MenuItem) => void
}

export function MenuItemCard({ item, onTap }: MenuItemCardProps) {
  const unavailable = !item.is_available

  return (
    <button
      className={cn(
        'w-full flex items-center gap-3 rounded-xl border bg-card p-3 text-left transition-all active:scale-[0.98]',
        unavailable
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:shadow-md hover:border-brand/30 cursor-pointer'
      )}
      onClick={() => !unavailable && onTap(item)}
      disabled={unavailable}
    >
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.name}
            fill
            className="object-cover"
            placeholder={item.image_placeholder ? 'blur' : 'empty'}
            blurDataURL={item.image_placeholder ?? undefined}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-2xl">🍽️</div>
        )}
        {unavailable && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70 rounded-lg">
            <span className="text-xs font-medium text-muted-foreground">Unavailable</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm leading-tight">{item.name}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.description}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <PriceDisplay sen={item.price_sen} size="sm" className="text-brand font-semibold" />
          {item.modifier_groups.length > 0 && (
            <span className="text-xs text-muted-foreground">Customisable</span>
          )}
        </div>
      </div>

      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
    </button>
  )
}
