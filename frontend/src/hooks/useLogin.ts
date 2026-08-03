import { login } from '@/api/auth'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useLogin = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['current-user'],
      })
    },
  })
}
