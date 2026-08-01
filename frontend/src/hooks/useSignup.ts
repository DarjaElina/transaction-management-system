import { signup } from '@/api/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useSignup = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: signup,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['current-user'],
      })
    },
  })
}
