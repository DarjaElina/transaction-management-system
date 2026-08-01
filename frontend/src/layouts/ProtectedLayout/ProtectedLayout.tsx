import { Navigate, Outlet, useNavigate } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Spinner } from '@/components/ui/spinner'
import { logout } from '@/api/auth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import ProtectedHeader from './ProtectedHeader'

function ProtectedLayout() {
  const { data: user, isLoading, error } = useCurrentUser()

  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const { mutate: logoutUser } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({
        queryKey: ['current-user'],
      })

      navigate('/login')
    },
  })

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <Spinner data-testid="spinner" />
      </div>
    )
  }

  if (error || !user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="space-y-8">
      <ProtectedHeader user={user} onLogout={() => logoutUser()} />

      <Outlet />
    </div>
  )
}

export default ProtectedLayout
