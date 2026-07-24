import type { TimePeriod } from '@/types/statistics.types'
import { api } from './client'

export const getIncomeExpenseOverview = async (
  start: Date,
  end: Date,
  period: TimePeriod,
  user_timezone: string,
) => {
  const { data } = await api.get('/statistics/income-expense', {
    params: {
      start,
      end,
      period,
      user_timezone,
    },
  })
  return data
}

export const getSpendingByCategory = async (start: Date, end: Date) => {
  const { data } = await api.get('/statistics/spending-by-category', {
    params: {
      start,
      end,
    },
  })
  return data
}

export const getFinancialSummary = async (user_timezone: string) => {
  const { data } = await api.get('/statistics/financial-summary', {
    params: {
      user_timezone,
    },
  })
  return data
}
