'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { LayoutDashboard, UtensilsCrossed, Users, Settings } from 'lucide-react'
import { AppSidebar, type NavItem } from '@/components/common/layout/AppSidebar'
import { AppHeader } from '@/components/common/layout/AppHeader'
import { LoadingPage } from '@/components/common/feedback/LoadingPage'
import { useAuth } from '@/hooks/useAuth'
import { useMerchant } from '@/hooks/useMerchant'

const NAV_ITEMS: NavItem[] = [
  { label: 'Orders',   href: '/dashboard/orders',   icon: <LayoutDashboard className="h-4 w-4" /> },
  { label: 'Menu',     href: '/dashboard/menu',     icon: <UtensilsCrossed className="h-4 w-4" /> },
  { label: 'Staff',    href: '/dashboard/staff',    icon: <Users className="h-4 w-4" /> },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings className="h-4 w-4" /> },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, role } = useAuth()
  const { merchant } = useMerchant()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }
    if (role && role !== 'merchant_owner' && role !== 'merchant_staff') {
      router.push('/login')
    }
  }, [isAuthenticated, role, router])

  if (!isAuthenticated) return <LoadingPage />

  const ownerNavItems = role === 'merchant_owner' ? NAV_ITEMS : NAV_ITEMS.slice(0, 1)

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar navItems={ownerNavItems} merchantName={merchant?.business_name} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppHeader title={merchant?.business_name ?? 'Dashboard'} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
