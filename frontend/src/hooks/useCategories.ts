import { useQuery } from '@tanstack/react-query'
import { apiClient } from '../api/client'
import type { ApiResponse, Category } from '../types/api.types'

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () =>
      apiClient.get<ApiResponse<Category[]>>('/api/categories').then((r) => r.data),
    staleTime: 10 * 60 * 1000,
  })
}
