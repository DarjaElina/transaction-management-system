import type { User } from '@/types/auth'
import NavSheet from './NavSheet'
import NavMenu from './NavMenu'
import Brand from '@/components/Brand'

type Props = {
  user: User
  onLogout: () => void
}

function ProtectedHeader({ user, onLogout }: Props) {
  return (
    <header className="mb-10 flex items-center justify-between">
      <Brand description={`Welcome back, ${user.first_name} 🤍`} />

      <>
        <NavMenu onLogout={onLogout} />
        <NavSheet onLogout={onLogout} />
      </>
    </header>
  )
}

export default ProtectedHeader
