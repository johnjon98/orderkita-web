'use client'

import { ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/currency'
import { cn } from '@/lib/utils/cn'

interface CartButtonProps {
  itemCount: number
  totalSen: number
  onClick: () => void
}

export function CartButton({ itemCount, totalSen, onClick }: CartButtonProps) {
  if (itemCount === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 z-40">
      <Button
        className="w-full h-14 text-base shadow-xl animate-slide-in"
        onClick={onClick}
      >
        <span className="flex items-center justify-between w-full">
          <span className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 text-sm font-bold">
              {itemCount}
            </span>
            <span>View cart</span>
          </span>
          <span className="font-bold">{formatPrice(totalSen)}</span>
        </span>
      </Button>
    </div>
  )
}
