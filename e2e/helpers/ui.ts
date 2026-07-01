import { expect, Page } from '@playwright/test'

export async function openTransactionDialog(page: Page) {
  await page.getByRole('button', { name: 'Add Transaction' }).click()
}

export async function createCategory(
  page: Page,
  name: string,
  type: 'Income' | 'Expense' = 'Income',
) {
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

export async function fillTransactionForm(
  page: Page,
  amount: string,
  description: string,
  category: string,
) {
  await page.getByRole('spinbutton', { name: 'Amount' }).fill(amount)

  await page.getByRole('textbox', { name: 'Description' }).fill(description)

  const combobox = page.getByRole('combobox', {
    name: 'Select a category or create',
  })

  await combobox.click()
  await combobox.fill(category)

  await page.getByRole('option', { name: category }).click()
}

async function saveTransaction(page: Page) {
  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByText('New category')).toBeHidden()

  await page.getByRole('button', { name: 'Save changes' }).click()

  await expect(page.getByText('Saving...')).toBeVisible()

  await expect(page.getByText('Create new transaction')).toBeHidden()
}

export async function createTransaction(
  page: Page,
  { amount = '100', description = 'Test expense', category = 'new' } = {},
) {
  await openTransactionDialog(page)

  await fillTransactionForm(page, amount, description, category)

  await page
    .getByRole('radio', {
      name: 'Expense',
    })
    .click()

  await saveTransaction(page)
}
