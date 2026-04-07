import type { Category, CategoryCreate } from '@/types/categories.types'
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

export const createCategory = async (
  newCategory: CategoryCreate,
): Promise<Category> => {
  const { data } = await api.post('/categories', newCategory)
  return data
}
