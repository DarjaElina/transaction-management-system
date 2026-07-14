export type IncomeExpenseOverview = {
  label: string
  income: string
  expense: string
}

export type StatisticsPeriod =
  | 'Last 7 days'
  | 'Last 30 days'
  | 'Last 90 days'
  | 'This year'
  | 'Last year'
  | 'All time'
