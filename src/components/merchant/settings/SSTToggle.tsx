'use client'

import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SSTToggleProps {
  enabled: boolean
  rateBps: number
  onChange: (enabled: boolean, rateBps: number) => void
}

export function SSTToggle({ enabled, rateBps, onChange }: SSTToggleProps) {
  const ratePercent = rateBps / 100

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Label>SST (Sales & Service Tax)</Label>
          <p className="text-xs text-muted-foreground mt-0.5">
            {enabled ? `${ratePercent}% SST applied to all orders` : 'SST disabled'}
          </p>
        </div>
        <Switch
          checked={enabled}
          onCheckedChange={(checked) => onChange(checked, rateBps)}
        />
      </div>

      {enabled && (
        <div className="space-y-1.5">
          <Label htmlFor="sst-rate">SST Rate (%)</Label>
          <div className="flex items-center gap-2">
            <Input
              id="sst-rate"
              type="number"
              min="0"
              max="100"
              step="0.1"
              value={ratePercent}
              onChange={(e) => onChange(enabled, Math.round(parseFloat(e.target.value) * 100))}
              className="w-24"
            />
            <span className="text-sm text-muted-foreground">%</span>
          </div>
        </div>
      )}
    </div>
  )
}
