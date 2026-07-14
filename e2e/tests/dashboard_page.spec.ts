import { expect, test } from '@playwright/test'
import { subMonths } from 'date-fns'

import { resetDb } from '../helpers/resetDb'
import { createTransaction, selectStatisticsPeriod } from '../helpers/ui'
import { selectDate } from '../helpers/common'

test.describe('Dashboard statistics', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('filters statistics according to selected date range', async ({
    page,
  }) => {
    await page.goto('/')

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

    await selectStatisticsPeriod(page, 'Last 7 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(1)

    await expect(page.getByTestId('income-bar')).toHaveCount(0)

    await selectStatisticsPeriod(page, 'Last 90 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(1)

    await expect(page.getByTestId('income-bar')).toHaveCount(1)
  })

  test('editing transaction date updates dashboard statistics', async ({
    page,
  }) => {
    await page.goto('/')

    await createTransaction(page, {
      date: subMonths(new Date(), 2),
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(0)

    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    await selectDate(page, new Date())

    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit transaction')).not.toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(1)
  })

  test('deleting transaction updates dashboard statistics', async ({
    page,
  }) => {
    await page.goto('/')

    await createTransaction(page, {
      amount: '25',
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(1)

    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Delete' }).click()

    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Transaction deleted')).toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days')

    await expect(page.getByTestId('expense-bar')).toHaveCount(0)
  })
})
