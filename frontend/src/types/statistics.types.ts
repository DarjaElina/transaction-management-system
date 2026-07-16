import type { ChartConfig } from '@/components/ui/chart'

export type TimePeriod = 'year' | 'month' | 'week' | 'day'

export type DateRangeOption =
  | 'last_7_days'
  | 'last_30_days'
  | 'last_90_days'
  | 'this_year'
  | 'last_year'
  | 'all_time'

export type DateRange = {
  period: TimePeriod
  start: Date
  end: Date
}

export type IncomeExpenseOverviewItem = {
  label: string
  income: number
  expense: number
}

export type SpendingByCategory = {
  category: string
  amount: string
}

export type SpendingChartData = {
  category: string
  amount: number
  fill: string
}

export type LimitSpendingChartOptions = {
  maxItems: number
  otherLabel?: string
}

export type SpendingChartConfigType = ChartConfig
