import { NavLink } from 'react-router'
import { navLinkClass } from '@/helpers'
import { ModeToggle } from '@/components/ModeToggle'

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

      <ModeToggle />
    </nav>
  )
}

export default PublicNavMenu
