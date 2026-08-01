import { getCategories } from '@/api/categories'
import { useQuery } from '@tanstack/react-query'

export const useCategories = (searchTerm: string) => {
  return useQuery({
    queryKey: ['categories', searchTerm],
    queryFn: () =>
      getCategories({
        name: searchTerm,
      }),
    enabled: Boolean(searchTerm),
  })
}
