import { getFinancialSummary } from '@/api/statistics'
import { useQuery } from '@tanstack/react-query'
import { FinanceStatCard } from '../FinanceStatCard/FinanceStatCard'
import { userTimezone } from '@/helpers/statistics.helpers'
import FinancialSummarySkeleton from './FinancialSummarySkeleton'
import { getErrorMessage } from '@/helpers'

export function FinancialSummary() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['financial-summary'],
    queryFn: () => getFinancialSummary(userTimezone),
  })

  if (isLoading) {
    return <FinancialSummarySkeleton />
  }

  if (error || !data) {
    return <p className="text-destructive">{getErrorMessage(error)}</p>
  }

  const formatMoney = (value: string) => {
    const number = Number(value)

    return number < 0
      ? `-€${Math.abs(number).toLocaleString()}`
      : `€${number.toLocaleString()}`
  }

  return (
    <div
      className="
      grid
      gap-6
      sm:grid-cols-2
      xl:grid-cols-4
    "
    >
      <FinanceStatCard
        testId="cash-flow"
        title="Cash Flow"
        amount={formatMoney(data.cash_flow.current)}
        change={Number(data.cash_flow.change)}
        increaseIsGood
      />

      <FinanceStatCard
        testId="savings-rate"
        title="Savings Rate"
        amount={`${data.savings_rate.current}%`}
        change={Number(data.savings_rate.change)}
        increaseIsGood
      />

      <FinanceStatCard
        testId="monthly-income"
        title="Monthly Income"
        amount={formatMoney(data.income.current)}
        change={Number(data.income.change)}
        increaseIsGood
      />

      <FinanceStatCard
        testId="monthly-expense"
        title="Monthly Expense"
        amount={formatMoney(data.expense.current)}
        change={Number(data.expense.change)}
        increaseIsGood={false}
      />
    </div>
  )
}
