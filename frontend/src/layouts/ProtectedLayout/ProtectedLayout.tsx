import { Navigate, Outlet } from 'react-router'
import { Spinner } from '@/components/ui/spinner'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import ProtectedHeader from './ProtectedHeader/ProtectedHeader'
import { useLogout } from '@/hooks/useLogout'
import { getErrorMessage } from '@/helpers'

function ProtectedLayout() {
  const { data: user, isLoading, error } = useCurrentUser()

  const { mutate } = useLogout()

  const logoutUser = () => {
    mutate(undefined, {
      onError: (error) => {
        getErrorMessage(error)
      },
    })
  }

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
