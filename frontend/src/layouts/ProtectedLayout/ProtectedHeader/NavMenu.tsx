import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router'

import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/ModeToggle'
import { navLinkClass } from '@/helpers'

type Props = {
  direction?: 'row' | 'column'
  onLogout: () => void
}

function NavMenu({ onLogout }: Props) {
  return (
    <nav className="hidden md:flex flex gap-2 items-center">
      <NavLink to="/dashboard" className={navLinkClass}>
        Dashboard
      </NavLink>

      <NavLink to="/transactions" className={navLinkClass}>
        Transactions
      </NavLink>

      <ModeToggle />

      <Button variant="outline" onClick={onLogout}>
        <LogOut className="mr-2 h-4 w-4" />
        Logout
      </Button>
    </nav>
  )
}

export default NavMenu
