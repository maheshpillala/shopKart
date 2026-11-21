import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { ApiResponse, Product } from '../types/api.types'

export function useCategoryProducts(name: string | undefined) {
  return useQuery({
    queryKey: ['categories', name, 'products'],
    queryFn: () =>
      apiClient
        .get<ApiResponse<Product[]>>(`/api/categories/${name}/products`)
        .then((r) => r.data),
    enabled: !!name,
  })
}
