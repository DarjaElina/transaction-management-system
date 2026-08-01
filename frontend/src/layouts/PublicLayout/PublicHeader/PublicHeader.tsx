import Brand from '@/components/Brand'
import PublicNavSheet from './PublicNavSheet'
import PublicNavMenu from './PublicNavMenu'

function PublicHeader() {
  return (
    <header className="mb-10 flex items-center justify-between">
      <Brand description="Personal Finance Manager" />

      <div>
        <PublicNavMenu />
        <PublicNavSheet />
      </div>
    </header>
  )
}

export default PublicHeader
