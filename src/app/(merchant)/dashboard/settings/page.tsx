'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SectionHeader } from '@/components/common/layout/SectionHeader'
import { SSTToggle } from '@/components/merchant/settings/SSTToggle'
import { useMerchant } from '@/hooks/useMerchant'
import { merchantsApi } from '@/lib/api/merchants'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { merchant, update } = useMerchant()

  async function handleSSTChange(enabled: boolean, rateBps: number) {
    try {
      await merchantsApi.updateMerchantSettings({ sst_enabled: enabled, sst_rate: rateBps })
      toast.success('Settings saved')
    } catch {
      toast.error('Failed to save settings')
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader title="Settings" />

      <Tabs defaultValue="tax">
        <TabsList>
          <TabsTrigger value="tax">Tax</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
        </TabsList>

        <TabsContent value="tax" className="mt-4">
          <div className="rounded-xl border bg-card p-6 max-w-md">
            {merchant && (
              <SSTToggle
                enabled={merchant.sst_enabled}
                rateBps={merchant.sst_rate}
                onChange={handleSSTChange}
              />
            )}
          </div>
        </TabsContent>

        <TabsContent value="business" className="mt-4">
          <div className="rounded-xl border bg-card p-6 max-w-md">
            <p className="text-sm text-muted-foreground">Business details editor coming soon.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
