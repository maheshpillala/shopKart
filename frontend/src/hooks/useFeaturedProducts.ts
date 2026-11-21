import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { ApiResponse, Product } from '../types/api.types'

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () =>
      apiClient.get<ApiResponse<Product[]>>('/api/products/featured').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  })
}
