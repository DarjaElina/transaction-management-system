import type { TimePeriod } from '@/types/statistics.types'
import { api } from './client'

export const getIncomeExpenseOverview = async (
  start: Date,
  end: Date,
  period: TimePeriod,
) => {
  const { data } = await api.get('/statistics/income-expense', {
    params: {
      start,
      end,
      period,
    },
  })
  return data
}
