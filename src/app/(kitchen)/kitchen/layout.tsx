'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AppHeader } from '@/components/common/layout/AppHeader'
import { ConnectionStatus } from '@/components/kitchen/board/ConnectionStatus'
import { LoadingPage } from '@/components/common/feedback/LoadingPage'
import { useAuth } from '@/hooks/useAuth'

export default function KitchenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, role } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (role && role !== 'kitchen_staff' && role !== 'merchant_owner' && role !== 'merchant_staff') {
      router.push('/login')
    }
  }, [isAuthenticated, role, router])

  // Request wake lock to prevent screen sleep on mounted tablets
  useEffect(() => {
    let wakeLock: WakeLockSentinel | null = null
    navigator.wakeLock?.request('screen').then((lock) => {
      wakeLock = lock
    }).catch(() => {})
    return () => { wakeLock?.release() }
  }, [])

  if (!isAuthenticated) return <LoadingPage />

  return (
    <div className="dark flex h-screen flex-col overflow-hidden bg-background text-foreground">
      <AppHeader
        title="Kitchen Display"
        actions={<ConnectionStatus />}
      />
      <div className="flex-1 overflow-hidden p-3">
        {children}
      </div>
    </div>
  )
}
