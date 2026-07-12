import { IncomeExpenseOverview } from '../types/statistics.types'

export const totalExpense = (data: IncomeExpenseOverview[]) => {
  return data.reduce((sum, item) => sum + Number(item.expense), 0)
}
