'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils/cn'

export interface NavItem {
  label: string
  href: string
  icon: React.ReactNode
}

interface AppSidebarProps {
  navItems: NavItem[]
  merchantName?: string
}

export function AppSidebar({ navItems, merchantName }: AppSidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r bg-background">
      {/* Brand */}
      <div className="flex h-14 flex-col justify-center border-b px-4 gap-0.5">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="4 2 126 32" fill="none" className="h-6 w-auto">
          <line x1="6" y1="4" x2="6" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="9" y1="4" x2="9" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
          <line x1="12" y1="4" x2="12" y2="14" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
          <path d="M6 14 Q6 18 9 18 Q12 18 12 14" stroke="#a855f7" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          <line x1="9" y1="18" x2="9" y2="32" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
          <ellipse cx="22" cy="9" rx="4" ry="5.5" stroke="#a855f7" strokeWidth="1.8" fill="none"/>
          <line x1="22" y1="14.5" x2="22" y2="32" stroke="#a855f7" strokeWidth="1.8" strokeLinecap="round"/>
          <text x="34" y="26" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="700" fill="#1e1b4b" letterSpacing="-0.5">Order<tspan fill="#a855f7">Kita</tspan></text>
        </svg>
        {merchantName && (
          <p className="text-xs text-muted-foreground truncate">{merchantName}</p>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-3">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand/10 text-brand'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
              )}
            >
              {item.icon}
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
