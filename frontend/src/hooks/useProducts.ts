import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { ApiResponse, Product } from '../types/api.types'

export function useProducts(q?: string) {
  const path = q ? `/api/products?q=${encodeURIComponent(q)}` : '/api/products'
  return useQuery({
    queryKey: ['products', { q }],
    queryFn: () => apiClient.get<ApiResponse<Product[]>>(path).then((r) => r.data),
  })
}
