import { getCurrentUser } from '@/api/auth'
import { useQuery } from '@tanstack/react-query'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['current-user'],
    queryFn: getCurrentUser,
    retry: false,
  })
}
