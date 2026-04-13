import type { OrderLineItem } from '@/types/order'

interface TicketLineItemProps {
  lineItem: OrderLineItem
}

export function TicketLineItem({ lineItem }: TicketLineItemProps) {
  return (
    <div className="space-y-0.5">
      <p className="font-semibold text-sm">
        {lineItem.quantity}× {lineItem.item_name}
      </p>
      {lineItem.modifiers.length > 0 && (
        <ul className="pl-4 space-y-0.5">
          {lineItem.modifiers.map((mod) => (
            <li key={mod.id} className="text-xs text-muted-foreground">
              + {mod.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
