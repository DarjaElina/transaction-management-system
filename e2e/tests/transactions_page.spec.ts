import { test, expect } from '@playwright/test'
import { resetDb } from '../helpers/resetDb'
import {
  createCategory,
  createTransaction,
  openTransactionDialog,
} from '../helpers/ui'

test.describe('Transactions page', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb()
    await page.goto('http://localhost:5173')
  })

  test('user can create income category', async ({ page }) => {
    await openTransactionDialog(page)
    await createCategory(page, 'New')
  })

  test('user can create expense category', async ({ page }) => {
    await openTransactionDialog(page)
    await createCategory(page, 'New', 'Expense')
  })

  test('user can create a transaction', async ({ page }) => {
    await createTransaction(page)
  })

  test('transaction appear in the list', async ({ page }) => {
    await createTransaction(page)

    await expect(page.getByRole('cell', { name: 'Test expense' })).toBeVisible()
  })

  test('user can edit a transaction', async ({ page }) => {
    await createTransaction(page)

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    await page.getByRole('textbox', { name: 'Description' }).clear()

    await page
      .getByRole('textbox', { name: 'Description' })
      .fill('New Transaction Name')

    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit transaction')).toBeHidden()

    await expect(
      page.getByRole('cell', { name: 'New Transaction Name' }),
    ).toBeVisible()
  })

  test('user can delete a transaction', async ({ page }) => {
    await createTransaction(page)

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Delete' }).click()

    await expect(
      page.getByText(
        'Are you sure you want to delete this transaction?CancelDelete',
      ),
    ).toBeVisible()

    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Test expense')).toBeHidden()

    await expect(page.getByText('Transaction deleted')).toBeVisible()
  })

  test.afterAll(async () => {
    await resetDb()
  })
})
