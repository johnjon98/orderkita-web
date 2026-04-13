'use client'

import { LogOut, ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/lib/utils/cn'

interface AppHeaderProps {
  title?: string
  subtitle?: string
  actions?: React.ReactNode
  className?: string
}

export function AppHeader({ title, subtitle, actions, className }: AppHeaderProps) {
  const { user, logout } = useAuth()

  return (
    <header className={cn('sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60', className)}>
      <div className="flex h-14 items-center gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-2 mr-auto">
          <ChefHat className="h-5 w-5 text-brand" />
          <div>
            {title && <span className="font-semibold text-sm">{title}</span>}
            {subtitle && <span className="text-xs text-muted-foreground ml-2">{subtitle}</span>}
          </div>
        </div>

        {actions && <div className="flex items-center gap-2">{actions}</div>}

        {user && (
          <div className="flex items-center gap-3 border-l pl-3">
            <span className="text-sm text-muted-foreground hidden sm:block">{user.full_name}</span>
            <Button variant="ghost" size="icon" onClick={logout} title="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
