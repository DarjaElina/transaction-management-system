import { Skeleton } from './ui/skeleton'

export function TransactionRowSkeleton() {
  return (
    <div className="grid grid-cols-6 items-center gap-4 py-3">
      <Skeleton className="h-4 w-4" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-40" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-6 w-24 rounded-full" />
      <Skeleton className="h-4 w-20 ml-auto" />
    </div>
  )
}
