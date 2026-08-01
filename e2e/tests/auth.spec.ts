import test, { expect } from '@playwright/test'
import { resetEnvironment } from '../helpers/reset'
import { login, signup } from '../helpers/auth'

test.describe('Auth flow', () => {
  test.beforeEach(async () => {
    await resetEnvironment()
  })

  test('user can sign up', async ({ page }) => {
    await signup(page)

    await expect(
      page.getByRole('link', { name: 'Budget Tracker Welcome back,' }),
    ).toBeVisible()
  })

  test('user can sign in', async ({ page }) => {
    await signup(page)

    await page.getByRole('button', { name: 'Logout' }).click()

    await expect(page.getByText('Sign in to manage your')).toBeVisible()

    await login(page)

    await expect(
      page.getByRole('link', { name: 'Budget Tracker Welcome back,' }),
    ).toBeVisible()
  })

  test('user can logout', async ({ page }) => {
    await signup(page)

    await page.getByRole('button', { name: 'Logout' }).click()

    await expect(page.getByText(/sign in to manage/i)).toBeVisible()
  })

  test('cannot sign up with existing email', async ({ page }) => {
    await signup(page)

    await page.getByRole('button', { name: 'Logout' }).click()

    await page
      .getByRole('paragraph')
      .filter({ hasText: "Don't have an account? Create" })
      .getByRole('link')
      .click()

    await signup(page)

    await expect(page.getByText(/already exists/i)).toBeVisible()
  })

  test('shows error for invalid credentials', async ({ page }) => {
    await signup(page)

    await page.getByRole('button', { name: 'Logout' }).click()

    await expect(page.getByText('Sign in to manage your')).toBeVisible()

    await login(page, { password: 'wrongpassword' })

    await expect(page.getByText(/incorrect email or password/i)).toBeVisible()
  })
})
