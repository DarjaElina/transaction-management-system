import { NavLink } from 'react-router'
import { Wallet, LogOut } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { User } from '@/types/auth'
import { ModeToggle } from '@/components/ModeToggle'
type Props = {
  user: User
  onLogout: () => void
}

function ProtectedHeader({ user, onLogout }: Props) {
  return (
    <header className="mb-10">
      <nav className="flex items-center justify-between">
        <div className="flex items-center gap-8">
          <NavLink to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Wallet className="h-5 w-5" />
            </div>

            <div>
              <h1 className="font-semibold">Budget Tracker</h1>

              <p className="text-xs text-muted-foreground">
                Welcome back, {user.first_name} 🤍
              </p>
            </div>
          </NavLink>

          <div className="flex items-center gap-2">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `
                rounded-lg
                px-3
                py-2
                text-sm
                transition-colors
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }
                `
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/transactions"
              className={({ isActive }) =>
                `
                rounded-lg
                px-3
                py-2
                text-sm
                transition-colors
                ${
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                }
                `
              }
            >
              Transactions
            </NavLink>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />

          <Button variant="outline" onClick={onLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </nav>
    </header>
  )
}

export default ProtectedHeader
