import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type FinanceStatCardProps = {
  testId: string
  title: string
  amount: string
  change?: number | null
  increaseIsGood?: boolean
  description?: string
}

export function FinanceStatCard({
  testId,
  title,
  amount,
  change,
  increaseIsGood = true,
  description = 'vs last month',
}: FinanceStatCardProps) {
  const hasChange = change !== null && change !== undefined

  const increased = hasChange && change > 0

  const isGood = increased ? increaseIsGood : !increaseIsGood

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div data-testid={testId} className="text-3xl font-bold">
          {amount}
        </div>

        {hasChange && (
          <div
            className={`
              mt-3 flex items-center gap-2
              text-sm font-medium
              ${isGood ? 'text-emerald-500' : 'text-rose-500'}
            `}
          >
            {increased ? (
              <ArrowUpRight className="size-5" />
            ) : (
              <ArrowDownRight className="size-5" />
            )}

            <span>{Math.abs(change)}%</span>

            <span className="font-normal text-muted-foreground">
              {description}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
