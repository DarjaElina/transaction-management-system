import { expect, type Page } from '@playwright/test'

export const signup = async (
  page: Page,
  {
    firstName = 'Jane',
    lastName = 'Doe',
    email = 'jane@example.com',
    password = 'secretpassword',
  } = {},
) => {
  await page.goto('/')

  await page.getByRole('button', { name: 'Create account' }).click()

  await page.getByRole('textbox', { name: 'First name' }).fill(firstName)

  await page.getByRole('textbox', { name: 'Last name' }).fill(lastName)

  await page.getByRole('textbox', { name: 'Email' }).fill(email)

  await page
    .getByRole('textbox', { name: 'Password', exact: true })
    .fill(password)

  await page
    .getByRole('textbox', {
      name: 'Confirm password',
      exact: true,
    })
    .fill(password)

  await page.getByRole('button', { name: 'Create account' }).nth(1).click()
}

export const login = async (
  page: Page,
  { email = 'jane@example.com', password = 'secretpassword' } = {},
) => {
  await page.goto('/login')

  await page.getByRole('textbox', { name: 'Email' }).fill(email)

  await page
    .getByRole('textbox', {
      name: 'Password',
      exact: true,
    })
    .fill(password)

  await page.getByRole('button', { name: 'Sign in' }).nth(1).click()
}
