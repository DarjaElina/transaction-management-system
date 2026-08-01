import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

import { ModeToggle } from '@/components/ModeToggle'
import { NavLink } from 'react-router'

function PublicNavSheet() {
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

          <div className="flex flex-col gap-6">
            <NavLink to="/" className="text-lg font-medium">
              Home
            </NavLink>

            <NavLink to="/login" className="text-lg font-medium">
              Sign in
            </NavLink>

            <NavLink to="/signup" className="text-lg font-medium">
              Create account
            </NavLink>

            <ModeToggle />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  )
}

export default PublicNavSheet
