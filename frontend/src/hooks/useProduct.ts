import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { ApiResponse, Product } from '../types/api.types'

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () =>
      apiClient.get<ApiResponse<Product>>(`/api/products/${id}`).then((r) => r.data),
    enabled: !!id,
  })
}
