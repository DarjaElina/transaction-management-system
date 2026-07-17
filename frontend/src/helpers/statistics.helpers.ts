import type { ChartConfig } from '@/components/ui/chart'

import type {
  LimitSpendingChartOptions,
  SpendingByCategory,
  SpendingChartData,
} from '@/types/statistics.types'

const colors = [
  'var(--color-emerald-500)',
  'var(--color-blue-500)',
  'var(--color-violet-500)',
  'var(--color-amber-500)',
  'var(--color-rose-500)',
  'var(--color-cyan-500)',
]

export const toSpendingChartData = (
  data: SpendingByCategory[],
): SpendingChartData[] =>
  data.map((item, index) => ({
    category: item.category,
    amount: Number(item.amount),
    fill: colors[index % colors.length],
  }))

export const limitSpendingChartData = (
  data: SpendingChartData[],
  { maxItems, otherLabel = 'Other' }: LimitSpendingChartOptions,
): SpendingChartData[] => {
  const sorted = [...data].sort((a, b) => b.amount - a.amount)

  if (sorted.length <= maxItems) {
    return sorted
  }

  const visibleItems = sorted.slice(0, maxItems - 1)

  const otherAmount = sorted
    .slice(maxItems - 1)
    .reduce((sum, item) => sum + item.amount, 0)

  return [
    ...visibleItems,
    {
      category: otherLabel,
      amount: otherAmount,
      fill: 'var(--color-slate-300)',
    },
  ]
}

export const createSpendingChartConfig = (
  data: SpendingChartData[],
): ChartConfig => {
  return data.reduce<ChartConfig>(
    (config, item) => {
      config[item.category] = {
        label: item.category,
        color: item.fill,
      }

      return config
    },
    {
      amount: {
        label: 'Amount',
      },
    },
  )
}
