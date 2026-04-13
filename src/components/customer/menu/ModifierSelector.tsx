'use client'

import { cn } from '@/lib/utils/cn'
import { formatModifierPrice } from '@/lib/utils/currency'
import type { ModifierGroup } from '@/types/menu'
import type { UUID } from '@/types/common'

interface ModifierSelectorProps {
  group: ModifierGroup
  selected: UUID[]
  onChange: (ids: UUID[]) => void
}

export function ModifierSelector({ group, selected, onChange }: ModifierSelectorProps) {
  const isSingleSelect = group.max_select === 1

  function toggle(id: UUID) {
    if (isSingleSelect) {
      onChange([id])
      return
    }
    if (selected.includes(id)) {
      onChange(selected.filter((s) => s !== id))
    } else if (selected.length < group.max_select) {
      onChange([...selected, id])
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold">{group.name}</span>
        <span className="text-xs text-muted-foreground">
          {group.is_required ? 'Required' : 'Optional'}
          {!isSingleSelect && ` · Pick up to ${group.max_select}`}
        </span>
      </div>

      <div className="space-y-1">
        {group.modifiers.filter((m) => m.is_available).map((mod) => {
          const isSelected = selected.includes(mod.id)
          const disabled = !isSelected && !isSingleSelect && selected.length >= group.max_select

          return (
            <button
              key={mod.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(mod.id)}
              className={cn(
                'w-full flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm transition-all',
                isSelected
                  ? 'border-brand bg-brand/5 text-brand'
                  : 'border-border bg-background hover:bg-muted',
                disabled && 'opacity-40 cursor-not-allowed'
              )}
            >
              <div className="flex items-center gap-2">
                <div className={cn(
                  'h-4 w-4 rounded-full border-2 flex items-center justify-center flex-shrink-0',
                  isSingleSelect ? 'rounded-full' : 'rounded-sm',
                  isSelected ? 'border-brand bg-brand' : 'border-muted-foreground'
                )}>
                  {isSelected && (
                    <div className={cn(
                      'bg-white',
                      isSingleSelect ? 'h-1.5 w-1.5 rounded-full' : 'h-2 w-2 rounded-sm'
                    )} />
                  )}
                </div>
                <span>{mod.name}</span>
              </div>
              {mod.price_sen > 0 && (
                <span className="text-xs text-muted-foreground font-medium">
                  {formatModifierPrice(mod.price_sen)}
                </span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
