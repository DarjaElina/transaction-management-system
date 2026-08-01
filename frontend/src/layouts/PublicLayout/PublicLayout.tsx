import { Outlet } from 'react-router'
import PublicHeader from './PublicHeader/PublicHeader'

function PublicLayout() {
  return (
    <>
      <PublicHeader />

      <div className="flex min-h-[calc(100vh-12rem)] items-center justify-center">
        <Outlet />
      </div>
    </>
  )
}

export default PublicLayout
