import type { DateRangeOption } from '@/types/statistics.types'
import { format } from 'date-fns'

export function formatChartLabel(date: string, range: DateRangeOption) {
  const d = new Date(date)

  switch (range) {
    case 'last_7_days':
      return format(d, 'EEE d')

    case 'last_30_days':
    case 'last_90_days':
      return format(d, 'MMM d')

    case 'this_year':
    case 'last_year':
      return format(d, 'MMM')

    case 'all_time':
      return format(d, 'yyyy')
  }
}
