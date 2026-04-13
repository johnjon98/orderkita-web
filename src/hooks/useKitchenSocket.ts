'use client'

import { useEffect, useRef } from 'react'
import { useKitchenStore } from '@/stores/kitchenStore'
import { kitchenApi } from '@/lib/api/kitchen'
import { getAccessToken } from '@/lib/api/base'
import type { Order } from '@/types/order'
import type { UUID } from '@/types/common'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? 'ws://localhost:8000'
const MAX_RECONNECT_DELAY = 30_000

interface KitchenEvent {
  type: 'order_event'
  order: Order
}

export function useKitchenSocket(merchantId: UUID | null) {
  const store = useKitchenStore()
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectDelay = useRef(1_000)
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const mounted = useRef(true)

  useEffect(() => {
    mounted.current = true

    // Load initial orders
    kitchenApi.listKitchenOrders().then(store.setOrders).catch(console.error)

    if (!merchantId) return

    function connect() {
      if (!mounted.current) return

      const token = getAccessToken()
      const url = `${WS_URL}/ws/kitchen/${merchantId}/?token=${token}`
      store.setConnectionStatus('connecting')

      const ws = new WebSocket(url)
      wsRef.current = ws

      ws.onopen = () => {
        reconnectDelay.current = 1_000
        store.setConnectionStatus('connected')
      }

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data as string) as KitchenEvent
          if (msg.type === 'order_event') {
            store.upsertOrder(msg.order)
          }
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        if (!mounted.current) return
        store.setConnectionStatus('disconnected')
        scheduleReconnect()
      }

      ws.onerror = () => {
        store.setConnectionStatus('error')
        ws.close()
      }
    }

    function scheduleReconnect() {
      reconnectTimer.current = setTimeout(() => {
        reconnectDelay.current = Math.min(reconnectDelay.current * 2, MAX_RECONNECT_DELAY)
        connect()
      }, reconnectDelay.current)
    }

    connect()

    return () => {
      mounted.current = false
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current)
      wsRef.current?.close()
    }
  }, [merchantId]) // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orders: store.orders,
    connectionStatus: store.connectionStatus,
    ordersByStatus: store.ordersByStatus,
  }
}
