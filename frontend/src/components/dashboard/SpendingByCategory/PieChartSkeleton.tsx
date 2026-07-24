import { Skeleton } from '@/components/ui/skeleton'

function PieChartSkeleton() {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6 py-6"
      data-testid="pieChartLoading"
    >
      <Skeleton className="aspect-square h-[280px] rounded-full" />

      <div className="flex w-full justify-center gap-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export default PieChartSkeleton
