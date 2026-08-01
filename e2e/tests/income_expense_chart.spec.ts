import { expect, test } from '@playwright/test'
import { subMonths } from 'date-fns'

import { createTransaction, selectStatisticsPeriod } from '../helpers/ui'
import { selectDate } from '../helpers/common'
import { resetEnvironment } from '../helpers/reset'
import { signup } from '../helpers/auth'

test.describe('Income expense overview chart', () => {
  test.beforeEach(async ({ page }) => {
    await resetEnvironment()
    await page.goto('/')
    await signup(page)
  })

  test('filters statistics according to selected date range', async ({
    page,
  }) => {
    await createTransaction(page, {
      amount: '10',
      description: 'Today expense',
    })

    await createTransaction(
      page,
      {
        amount: '20',
        description: 'Old income',
        category: 'Test',
        date: subMonths(new Date(), 2),
      },
      true,
      'Income',
    )

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'income-expense')

    const chart = page.getByTestId('income-expense-chart')

    await expect(chart).toHaveAttribute('data-total-expense', '10')
    await expect(chart).toHaveAttribute('data-total-income', '0')

    await selectStatisticsPeriod(page, 'Last 90 days', 'income-expense')

    await expect(chart).toHaveAttribute('data-total-expense', '10')
    await expect(chart).toHaveAttribute('data-total-income', '20')
  })

  test('editing transaction date updates dashboard statistics', async ({
    page,
  }) => {
    await createTransaction(page, {
      date: subMonths(new Date(), 2),
      amount: '10',
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'income-expense')

    const chart = page.getByTestId('income-expense-chart')
    await expect(chart).toHaveAttribute('data-total-expense', '0')

    await page.goto('/transactions')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()
    await selectDate(page, new Date())
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Edit transaction')).not.toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'income-expense')
    await expect(chart).toHaveAttribute('data-total-expense', '10')
  })

  test('deleting transaction updates dashboard statistics', async ({
    page,
  }) => {
    await createTransaction(page, {
      amount: '25',
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'income-expense')

    const chart = page.getByTestId('income-expense-chart')
    await expect(chart).toHaveAttribute('data-total-expense', '25')

    await page.goto('/transactions')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText('Transaction deleted')).toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'income-expense')
    await expect(chart).toHaveAttribute('data-total-expense', '0')
  })
})
