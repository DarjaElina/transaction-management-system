import { createCategory } from '@/api/categories'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateCategory = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createCategory,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['categories'],
      })
    },
  })
}
