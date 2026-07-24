import test, { expect } from '@playwright/test'
import { resetDb } from '../helpers/resetDb'
import { createTransaction } from '../helpers/ui'

test.describe('Financial summary', () => {
  test.beforeEach(async () => {
    await resetDb()
  })

  test('calculates financial summary from transactions', async ({ page }) => {
    await page.goto('/')

    await createTransaction(page, {
      amount: '25',
    })

    await createTransaction(
      page,
      {
        amount: '100',
        category: 'Test',
      },
      true,
      'Income',
    )

    await page.goto('/dashboard')

    await expect(page.getByTestId('monthly-income')).toContainText('€100')

    await expect(page.getByTestId('monthly-expense')).toContainText('€25')

    await expect(page.getByTestId('cash-flow')).toContainText('€75')

    await expect(page.getByTestId('savings-rate')).toContainText('75.0%')
  })

  test('updates summary after editing transaction', async ({ page }) => {
    await page.goto('/')

    await createTransaction(page, {
      amount: '50',
    })

    await page.goto('/dashboard')

    const expenseBlock = page.getByTestId('monthly-expense')
    await expect(expenseBlock).toContainText('€50')

    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Edit' }).click()
    await page.getByRole('spinbutton', { name: 'Amount' }).fill('200')
    await page.getByRole('button', { name: 'Save changes' }).click()
    await expect(page.getByText('Edit transaction')).not.toBeVisible()

    await page.goto('/dashboard')

    await expect(expenseBlock).toContainText('€200')
  })

  test('updates summary after deleting transaction', async ({ page }) => {
    await page.goto('/')

    await createTransaction(page, {
      amount: '50',
    })

    await page.goto('/dashboard')

    const expenseBlock = page.getByTestId('monthly-expense')
    await expect(expenseBlock).toContainText('€50')

    await page.goto('/')

    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.getByRole('menuitem', { name: 'Delete' }).click()
    await page.getByRole('button', { name: 'Delete' }).click()
    await expect(page.getByText('Transaction deleted')).toBeVisible()

    await page.goto('/dashboard')

    await expect(expenseBlock).toContainText('€0')
  })
})
