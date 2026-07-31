import { Label, Pie, PieChart } from 'recharts'
import { useQuery } from '@tanstack/react-query'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

import { getSpendingByCategory } from '@/api/statistics'
import type { DateRangeOption } from '@/types/statistics.types'
import DateRangeSelect from '../IncomeExpenseOverview/DateRangeSelect'
import { useState } from 'react'
import {
  createSpendingChartConfig,
  limitSpendingChartData,
  toSpendingChartData,
} from '@/helpers/statistics.helpers'
import { getDateRange } from '@/helpers/getDateRange'
import PieChartSkeleton from './PieChartSkeleton'
import { getErrorMessage } from '@/helpers'

function CategoryPieChart() {
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRangeOption>('all_time')
  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['spending-by-category', dateRangeOption],
    queryFn: () => getSpendingByCategory(start, end),
  })

  const { start, end } = getDateRange(dateRangeOption)

  const chartData = limitSpendingChartData(toSpendingChartData(data), {
    maxItems: 6,
  })

  const total = chartData.reduce((sum, item) => sum + item.amount, 0)

  const chartConfig = createSpendingChartConfig(chartData)

  return (
    <Card data-testid="spending-category-container" className="xl:col-span-2">
      <CardHeader className="items-center pb-0">
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>
          See where your money goes across different categories
        </CardDescription>
        <DateRangeSelect
          value={dateRangeOption}
          onChange={setDateRangeOption}
        />
      </CardHeader>

      <CardContent className="flex-1 pb-0">
        {isLoading && <PieChartSkeleton />}
        {error && <p className="text-destructive">{getErrorMessage(error)}</p>}
        {!isLoading && !error && chartData.length === 0 && (
          <p className="text-muted-foreground">
            No expenses for selected period.
          </p>
        )}
        {!isLoading && !error && chartData.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="
            mx-auto
            aspect-square
            pb-0
            max-h-[350px]
            [&_.recharts-pie-label-text]:fill-foreground
          "
          >
            <PieChart>
              <ChartTooltip content={<ChartTooltipContent hideLabel />} />

              <Pie
                data={chartData}
                dataKey="amount"
                nameKey="category"
                innerRadius={80}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy - 24}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy || 0}
                            className="fill-muted-foreground"
                          >
                            Total spent
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
              <ChartLegend
                content={<ChartLegendContent nameKey="category" />}
                className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
              />
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default CategoryPieChart
