import type { Category } from '@/types/categories.types'
import { api } from './client'

interface Filters {
  name: string
}

export const getCategories = async (filters: Filters): Promise<Category[]> => {
  const { data } = await api.get('/categories', {
    params: {
      name: filters.name,
    },
  })
  return data
}
