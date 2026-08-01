import { Outlet } from 'react-router'
import { Toaster } from 'sonner'

function RootLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
        <Toaster richColors />
      </div>
    </div>
  )
}

export default RootLayout
