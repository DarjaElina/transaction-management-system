import { Button } from '@/components/ui/button'
import { NavLink } from 'react-router'

function SessionExpired() {
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      <p>Your session has expired, please sign in again</p>
      <NavLink to="/login">
        <Button>Sign in</Button>
      </NavLink>
    </div>
  )
}

export default SessionExpired
