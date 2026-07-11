import {
  subMonths,
  startOfYear,
  endOfYear,
  subDays,
  startOfDay,
  endOfDay,
  startOfWeek,
} from 'date-fns'
import type { DateRange, DateRangeOption } from '@/types/statistics.types'

export const getDateRange = (option: DateRangeOption): DateRange => {
  const now = new Date()

  switch (option) {
    case 'last_7_days':
      return {
        period: 'day',
        start: startOfDay(subDays(now, 7)),
        end: endOfDay(now),
      }

    case 'last_30_days':
      return {
        period: 'day',
        start: startOfDay(subDays(now, 30)),
        end: endOfDay(now),
      }

    case 'last_90_days':
      return {
        period: 'week',
        start: startOfWeek(subDays(now, 90), { weekStartsOn: 1 }),
        end: endOfDay(now),
      }

    case 'this_year':
      return {
        period: 'month',
        start: startOfYear(now),
        end: endOfDay(now),
      }

    case 'last_year': {
      const lastYear = subMonths(now, 12)
      return {
        period: 'month',
        start: startOfYear(lastYear),
        end: endOfYear(lastYear),
      }
    }

    case 'all_time':
      return {
        period: 'year',
        start: new Date(2025, 0, 1),
        end: endOfDay(now),
      }
  }
}
