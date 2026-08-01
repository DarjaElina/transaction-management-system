import { LogOut, Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { ModeToggle } from '@/components/ModeToggle'
import { NavLink } from 'react-router'

type Props = {
  onLogout: () => void
}

function NavSheet({ onLogout }: Props) {
  return (
    <nav className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="p-10">
          <SheetTitle className="sr-only">Mobile navigation</SheetTitle>
          <NavLink to="/dashboard" className="text-lg font-medium">
            Dashboard
          </NavLink>

          <NavLink to="/transactions" className="text-lg font-medium">
            Transactions
          </NavLink>
          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
          <ModeToggle />
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default NavSheet
