'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { merchantsApi, type UpdateMerchantPayload } from '@/lib/api/merchants'

export function useMerchant() {
  const queryClient = useQueryClient()

  const { data: merchant, isLoading, error } = useQuery({
    queryKey: ['merchant-me'],
    queryFn: () => merchantsApi.getMerchantMe(),
  })

  const { mutateAsync: update, isPending: isUpdating } = useMutation({
    mutationFn: (payload: UpdateMerchantPayload) => merchantsApi.updateMerchantMe(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['merchant-me'], updated)
    },
  })

  return {
    merchant: merchant ?? null,
    isLoading,
    error: error as Error | null,
    update,
    isUpdating,
  }
}
