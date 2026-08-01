import { logout } from '@/api/auth'
import { useQueryClient, useMutation } from '@tanstack/react-query'

export const useLogout = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.removeQueries()
      queryClient.cancelQueries()
      queryClient.setQueryData(['current-user'], null)
    },
  })
}
