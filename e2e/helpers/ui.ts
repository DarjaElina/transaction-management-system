import { expect, Page } from '@playwright/test'
import { selectDate } from './selectDate'

export const openTransactionDialog = async (page: Page) => {
  await page.getByRole('button', { name: 'Add Transaction' }).click()
}

export const createCategory = async (
  page: Page,
  name: string,
  type: 'Income' | 'Expense' = 'Income',
) => {
  const combobox = page.getByRole('combobox', {
    name: 'Select a category or create',
  })

  await combobox.click()
  await combobox.fill(name)

  await page
    .getByRole('option', { name: `Create "${name.toLowerCase()}"` })
    .click()

  if (type === 'Expense') {
    await page.getByRole('radio', { name: 'Expense' }).click()
  }

  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(
    page.getByText(`Category ${name.toLowerCase()} created successfully!`),
  ).toBeVisible()
}

export const fillTransactionForm = async (
  page: Page,
  amount: string,
  description: string,
  category: string,
  date?: Date,
) => {
  await page.getByRole('spinbutton', { name: 'Amount' }).fill(amount)

  await page.getByRole('textbox', { name: 'Description' }).fill(description)

  if (date) {
    await selectDate(page, date)
  }

  const combobox = page.getByRole('combobox', {
    name: 'Select a category or create',
  })

  await combobox.click()
  await combobox.fill(category)

  await page.getByRole('option', { name: category }).click()
}

export const saveTransaction = async (page: Page) => {
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByText('New category')).toBeHidden()

  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByText('Create new transaction')).toBeHidden()
}

export const createTransaction = async (
  page: Page,
  {
    amount = '100',
    description = 'Test expense',
    category = 'new',
    date,
  }: {
    amount?: string
    description?: string
    category?: string
    date?: Date
  } = {},
  withCategory: boolean = true,
) => {
  await openTransactionDialog(page)

  await fillTransactionForm(page, amount, description, category, date)

  if (withCategory) {
    await page
      .getByRole('radio', {
        name: 'Expense',
      })
      .click()
  }

  await saveTransaction(page)
}
