'use client'

import { KitchenBoard } from '@/components/kitchen/board/KitchenBoard'
import { useAuth } from '@/hooks/useAuth'
import { useKitchenSocket } from '@/hooks/useKitchenSocket'

export default function KitchenPage() {
  const { merchantId } = useAuth()
  useKitchenSocket(merchantId) // initialises WebSocket + loads orders into kitchenStore

  return <KitchenBoard />
}
