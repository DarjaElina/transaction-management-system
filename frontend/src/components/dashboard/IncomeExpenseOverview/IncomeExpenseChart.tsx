import { getIncomeExpenseOverview } from '@/api/statistics'
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import { useQuery } from '@tanstack/react-query'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { useState } from 'react'
import type { DateRangeOption } from '@/types/statistics.types'
import DateRangeSelect from './DateRangeSelect'
import { getDateRange } from '@/helpers/getDateRange'
import { formatChartLabel } from '@/helpers/formatChartLabel'

const chartConfig = {
  income: {
    label: 'Income',
    color: '#24a328',
  },
  expense: {
    label: 'Expense',
    color: '#f35a3c',
  },
} satisfies ChartConfig

function IncomeExpenseChart() {
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRangeOption>('all_time')

  const { period, start, end } = getDateRange(dateRangeOption)

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['income-expense', dateRangeOption],
    queryFn: () => getIncomeExpenseOverview(start, end, period, userTimezone),
  })

  return (
    <Card className="md:col-span-2">
      <CardHeader>
        <CardTitle>Income vs Expense</CardTitle>
        <div className="flex gap-2">
          <DateRangeSelect
            value={dateRangeOption}
            onChange={setDateRangeOption}
          />
        </div>
      </CardHeader>

      <CardContent>
        {isLoading && <p>Loading data...</p>}
        {error && <p>Error loading data.</p>}
        {!isLoading && !error && (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  formatChartLabel(value, dateRangeOption)
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      value ? new Date(value).toLocaleDateString() : ''
                    }
                  />
                }
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="income" fill="var(--color-income)" radius={4} />
              <Bar dataKey="expense" fill="var(--color-expense)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default IncomeExpenseChart
