import { Separator } from '@/components/ui/separator'
import { PriceDisplay } from '@/components/common/data-display/PriceDisplay'

interface CartSummaryProps {
  subtotalSen: number
  sstSen: number
  totalSen: number
}

export function CartSummary({ subtotalSen, sstSen, totalSen }: CartSummaryProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal</span>
        <PriceDisplay sen={subtotalSen} size="sm" />
      </div>
      {sstSen > 0 && (
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">SST (6%)</span>
          <PriceDisplay sen={sstSen} size="sm" />
        </div>
      )}
      <Separator />
      <div className="flex justify-between font-semibold">
        <span>Total</span>
        <PriceDisplay sen={totalSen} size="md" />
      </div>
    </div>
  )
}
