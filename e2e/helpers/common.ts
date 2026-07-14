import { Page } from '@playwright/test'
import { differenceInCalendarMonths, format } from 'date-fns'
import { IncomeExpenseOverview } from '../types/statistics.types'

export const totalExpense = (data: IncomeExpenseOverview[]) => {
  return data.reduce((sum, item) => sum + Number(item.expense), 0)
}

export const selectDate = async (page: Page, target: Date) => {
  await page.getByRole('button', { name: 'Date' }).click()

  const current = new Date()

  const diff = differenceInCalendarMonths(target, current)

  const button =
    diff > 0
      ? page.getByRole('button', { name: 'Go to the Next Month' })
      : page.getByRole('button', { name: 'Go to the Previous Month' })

  for (let i = 0; i < Math.abs(diff); i++) {
    await button.click()
  }

  await page
    .getByRole('button', {
      name: format(target, 'MMMM do, yyyy'),
    })
    .click()

  await page.getByRole('button', { name: 'Date' }).click()
}
