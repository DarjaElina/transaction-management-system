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
