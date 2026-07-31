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
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card'
import { useState } from 'react'
import type { DateRangeOption } from '@/types/statistics.types'
import DateRangeSelect from './DateRangeSelect'
import { formatChartLabel } from '@/helpers/formatChartLabel'
import { getDateRange } from '@/helpers/getDateRange'
import {
  getIncomeExpenseTotals,
  userTimezone,
} from '@/helpers/statistics.helpers'
import LineChartSkeleton from './LineChartSkeleton'
import { getErrorMessage } from '@/helpers'

const chartConfig = {
  income: {
    label: 'Income',
    color: 'var(--color-emerald-500)',
  },
  expense: {
    label: 'Expense',
    color: 'var(--color-rose-500)',
  },
} satisfies ChartConfig

function IncomeExpenseChart() {
  const [dateRangeOption, setDateRangeOption] =
    useState<DateRangeOption>('last_30_days')

  const { period, start, end } = getDateRange(dateRangeOption)

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['income-expense', dateRangeOption],
    queryFn: () => getIncomeExpenseOverview(start, end, period, userTimezone),
  })

  const { income, expense } = getIncomeExpenseTotals(data)

  return (
    <Card className="xl:col-span-4" data-testid="income-expense-container">
      <CardHeader>
        <CardTitle>Financial Trend</CardTitle>

        <CardDescription>Income and expenses over time</CardDescription>

        <DateRangeSelect
          value={dateRangeOption}
          onChange={setDateRangeOption}
        />
      </CardHeader>

      <CardContent>
        {isLoading && <LineChartSkeleton />}

        {error && <p className="text-destructive">{getErrorMessage(error)}</p>}

        {!isLoading && !error && data.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="h-[300px] w-full"
            data-testid="income-expense-chart"
            data-total-income={income}
            data-total-expense={expense}
          >
            <LineChart
              accessibilityLayer
              data={data}
              margin={{
                left: 20,
                right: 20,
                top: 20,
                bottom: 20,
              }}
            >
              <CartesianGrid vertical={false} />

              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tickFormatter={(value) =>
                  formatChartLabel(value, dateRangeOption)
                }
              />

              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) =>
                      value ? new Date(value).toLocaleDateString() : ''
                    }
                  />
                }
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Line
                dataKey="income"
                type="monotone"
                stroke="var(--color-income)"
                strokeWidth={3}
                dot={false}
              />

              <Line
                dataKey="expense"
                type="monotone"
                stroke="var(--color-expense)"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}

export default IncomeExpenseChart
