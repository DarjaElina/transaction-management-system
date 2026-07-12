import { expect, test, type Page } from '@playwright/test'
import { subMonths } from 'date-fns'

import { resetDb } from '../helpers/resetDb'
import { createTransaction } from '../helpers/ui'
import { selectDate } from '../helpers/selectDate'

function totalExpense(data: Array<{ expense: string }>) {
  return data.reduce((sum, item) => sum + Number(item.expense), 0)
}

async function waitForStatisticsResponse(page: Page, period?: string) {
  return page.waitForResponse((response) => {
    const url = new URL(response.url())

    if (url.pathname !== '/api/statistics/income-expense') {
      return false
    }

    if (response.request().method() !== 'GET') {
      return false
    }

    if (period) {
      return url.searchParams.get('period') === period
    }

    return true
  })
}

test.describe('Dashboard statistics', () => {
  test.beforeEach(async ({ page }) => {
    await resetDb()
  })

  test.afterAll(async () => {
    await resetDb()
  })

  test('sends selected period and timezone to backend', async ({ page }) => {
    await page.goto('http://localhost:5173/dashboard')

    await page.getByRole('combobox').click()

    const [response] = await Promise.all([
      waitForStatisticsResponse(page, 'day'),
      page.getByRole('option', { name: 'Last 7 days' }).click(),
    ])

    const url = new URL(response.request().url())

    expect(url.searchParams.get('period')).toBe('day')
    expect(url.searchParams.get('start')).not.toBeNull()
    expect(url.searchParams.get('end')).not.toBeNull()
    expect(url.searchParams.get('user_timezone')).not.toBeNull()
  })

  test('filters statistics according to selected date range', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    await createTransaction(page, {
      amount: '10',
      description: 'Today expense',
    })

    await createTransaction(
      page,
      {
        amount: '20',
        description: 'Old expense',
        date: subMonths(new Date(), 2),
      },
      false,
    )

    await page.goto('http://localhost:5173/dashboard')

    await page.getByRole('combobox').click()

    let [response] = await Promise.all([
      waitForStatisticsResponse(page, 'day'),
      page.getByRole('option', { name: 'Last 7 days' }).click(),
    ])

    let body = await response.json()

    expect(totalExpense(body)).toBe(10)

    await page.getByRole('combobox').click()

    ;[response] = await Promise.all([
      waitForStatisticsResponse(page, 'year'),
      page.getByRole('option', { name: 'All time' }).click(),
    ])

    body = await response.json()

    expect(totalExpense(body)).toBe(30)
  })

  test('new transactions are reflected in dashboard statistics', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    await createTransaction(page, {
      amount: '15',
      description: 'Coffee',
    })

    const [response] = await Promise.all([
      waitForStatisticsResponse(page),
      page.goto('http://localhost:5173/dashboard'),
    ])

    const body = await response.json()

    expect(body.length).toBeGreaterThan(0)
    expect(totalExpense(body)).toBe(15)
  })

  test('editing transaction date updates dashboard statistics', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    await createTransaction(page, {
      amount: '25',
      description: 'Move me',
    })

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Edit' }).click()

    await selectDate(page, subMonths(new Date(), 2))

    await page.getByRole('button', { name: 'Save changes' }).click()

    await expect(page.getByText('Edit transaction')).toBeHidden()

    await page.goto('http://localhost:5173/dashboard')

    await page.getByRole('combobox').click()

    let [response] = await Promise.all([
      waitForStatisticsResponse(page, 'day'),
      page.getByRole('option', { name: 'Last 7 days' }).click(),
    ])

    let body = await response.json()

    expect(totalExpense(body)).toBe(0)

    await page.getByRole('combobox').click()

    ;[response] = await Promise.all([
      waitForStatisticsResponse(page, 'year'),
      page.getByRole('option', { name: 'All time' }).click(),
    ])

    body = await response.json()

    expect(totalExpense(body)).toBe(25)
  })

  test('deleting transaction updates dashboard statistics', async ({
    page,
  }) => {
    await page.goto('http://localhost:5173')

    await createTransaction(page, {
      amount: '25',
    })

    await page.getByRole('button', { name: 'Open menu' }).click()

    await page.getByRole('menuitem', { name: 'Delete' }).click()

    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page.getByText('Transaction deleted')).toBeVisible()

    await page.goto('http://localhost:5173/dashboard')

    const [response] = await Promise.all([
      waitForStatisticsResponse(page),
      page.reload(),
    ])

    const body = await response.json()

    expect(totalExpense(body)).toBe(0)
  })
})
