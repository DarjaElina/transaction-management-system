import { Outlet } from 'react-router'

function RootLayout() {
  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <Outlet />
      </div>
    </div>
  )
}

export default RootLayout
