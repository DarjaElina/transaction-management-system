import { NavLink } from 'react-router'
import { Wallet } from 'lucide-react'

import { ModeToggle } from '@/components/ModeToggle'

function PublicHeader() {
  return (
    <header className="mb-10">
      <nav className="flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Wallet className="h-5 w-5" />
          </div>

          <div>
            <h1 className="font-semibold">Budget Tracker</h1>

            <p className="text-xs text-muted-foreground">
              Personal Finance Manager
            </p>
          </div>
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
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
            to="/"
          >
            Home
          </NavLink>

          <NavLink
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
            to="/login"
          >
            Sign in
          </NavLink>

          <NavLink
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
            to="/signup"
          >
            Create account
          </NavLink>

          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}

export default PublicHeader
