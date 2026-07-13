import { Page } from '@playwright/test'

export const waitForStatisticsResponse = (page: Page, period?: string) => {
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
