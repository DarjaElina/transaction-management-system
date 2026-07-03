import { ModeToggle } from '@/components/ModeToggle'
import { buttonVariants } from '@/components/ui/button'
import { NavLink, Outlet } from 'react-router'

function Layout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <nav className="w-full flex justify-end gap-2 items-center">
          <NavLink
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            to="/"
          >
            Home
          </NavLink>
          <NavLink
            className={buttonVariants({ variant: 'ghost', size: 'sm' })}
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          <ModeToggle />
        </nav>
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
