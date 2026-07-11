import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it } from 'vitest'

import { renderWithProviders } from '@/helpers/testHelpers'
import IncomeExpenseChart from './IncomeExpenseChart'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'

describe('IncomeExpenseChart', () => {
  it('shows loading state', () => {
    renderWithProviders(<IncomeExpenseChart />)

    expect(screen.getByText(/loading data/i)).toBeInTheDocument()
  })

  it('shows error state when request fails', async () => {
    server.use(
      http.get('http://localhost:8000/api/statistics/income-expense', () => {
        return new HttpResponse(null, {
          status: 500,
        })
      }),
    )

    renderWithProviders(<IncomeExpenseChart />)

    expect(await screen.findByText(/error loading data/i)).toBeInTheDocument()
  })

  it('requests statistics with user timezone', async () => {
    let receivedTimezone = ''

    server.use(
      http.get(
        'http://localhost:8000/api/statistics/income-expense',
        ({ request }) => {
          const url = new URL(request.url)

          receivedTimezone = url.searchParams.get('user_timezone') ?? ''

          return HttpResponse.json([])
        },
      ),
    )

    renderWithProviders(<IncomeExpenseChart />)

    await waitFor(() => {
      expect(receivedTimezone).toBeTruthy()
    })
  })
})
