import test, { expect } from '@playwright/test'
import { subMonths } from 'date-fns'
import { createTransaction, selectStatisticsPeriod } from '../helpers/ui'
import { selectDate } from '../helpers/common'
import { resetEnvironment } from '../helpers/reset'
import { signup } from '../helpers/auth'

test.describe('Spending by category chart', () => {
  test.beforeEach(async ({ page }) => {
    await resetEnvironment()
    await page.goto('/')
    await signup(page)
  })

  test('filters spending categories according to selected date range', async ({
    page,
  }) => {
    await createTransaction(page, {
      amount: '10',
      description: 'Today expense',
      category: 'Food',
    })

    await createTransaction(page, {
      amount: '20',
      description: 'Old expense',
      category: 'Transport',
      date: subMonths(new Date(), 2),
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(page.getByText('food')).toBeVisible()
    await expect(page.getByText('transport')).not.toBeVisible()
    await expect(page.getByText('10', { exact: true })).toBeVisible()

    await selectStatisticsPeriod(page, 'Last 90 days', 'spending-category')

    await expect(page.getByText('food')).toBeVisible()
    await expect(page.getByText('transport')).toBeVisible()
    await expect(page.getByText('30', { exact: true })).toBeVisible()
  })

  test('editing transaction date updates spending categories', async ({
    page,
  }) => {
    await createTransaction(page, {
      amount: '15',
      description: 'Old groceries',
      category: 'Food',
      date: subMonths(new Date(), 2),
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(page.getByText('Food')).not.toBeVisible()
    await expect(page.getByText('No expenses for selected')).toBeVisible()

    await page.goto('/transactions')

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    await selectDate(page, new Date())

    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit transaction')).not.toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(page.getByText('Food')).toBeVisible()
    await expect(page.getByText('15', { exact: true })).toBeVisible()
  })

  test('deleting transaction updates spending categories', async ({ page }) => {
    await createTransaction(page, {
      amount: '25',
      description: 'Dinner',
      category: 'Food',
    })

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(page.getByText('Food')).toBeVisible()
    await expect(page.getByText('25', { exact: true })).toBeVisible()

    await page.goto('/transactions')

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Delete' }).click()

    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Transaction deleted')).toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(page.getByText('Food')).not.toBeVisible()
  })

  test('shows empty state when there are no expenses', async ({ page }) => {
    await expect(page.getByText('Welcome back, Jane 🤍')).toBeVisible()

    await page.goto('/dashboard')

    await selectStatisticsPeriod(page, 'Last 7 days', 'spending-category')

    await expect(
      page.getByText(/no expenses for selected period/i),
    ).toBeVisible()
  })
})
