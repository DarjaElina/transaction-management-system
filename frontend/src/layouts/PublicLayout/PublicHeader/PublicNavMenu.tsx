import { NavLink } from 'react-router'
import { navLinkClass } from '@/helpers'

function PublicNavMenu() {
  return (
    <nav className="hidden md:flex flex gap-2 items-center">
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>

      <NavLink to="/login" className={navLinkClass}>
        Sign in
      </NavLink>

      <NavLink to="/signup" className={navLinkClass}>
        Create account
      </NavLink>
    </nav>
  )
}

export default PublicNavMenu
