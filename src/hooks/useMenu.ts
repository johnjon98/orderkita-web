'use client'

import { useQuery } from '@tanstack/react-query'
import { menusApi } from '@/lib/api/menus'

export function useMenu(slug: string) {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['menu', slug],
    queryFn: () => menusApi.getPublicMenu(slug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!slug,
  })

  return {
    menu: data ?? null,
    merchant: data?.merchant ?? null,
    categories: data?.categories ?? [],
    isLoading,
    error: error as Error | null,
    refetch,
  }
}
