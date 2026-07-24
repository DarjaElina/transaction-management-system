import { Skeleton } from '@/components/ui/skeleton'

function LineChartSkeleton() {
  return (
    <div className="space-y-4 py-6" data-testid="lineChartLoading">
      <Skeleton className="h-[280px] w-full rounded-lg" />

      <div className="flex justify-center gap-6">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
  )
}

export default LineChartSkeleton
