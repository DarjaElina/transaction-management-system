import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/helpers/tests.helpers'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'
import { API_URL } from '@/mocks/config'
import CategoryPieChart from './CategoryPieChart'

describe('CategoryPieChart', () => {
  it('shows loading state', () => {
    renderWithProviders(<CategoryPieChart />)

    expect(screen.getByTestId(/pieChartLoading/i)).toBeInTheDocument()
  })

  it('renders total spending', async () => {
    renderWithProviders(<CategoryPieChart />)

    expect(await screen.findByText('70')).toBeInTheDocument()

    expect(screen.getByText(/total spent/i)).toBeInTheDocument()
  })

  it('shows empty state when there is no data', async () => {
    server.use(
      http.get(`${API_URL}/statistics/spending-by-category`, () =>
        HttpResponse.json([]),
      ),
    )

    renderWithProviders(<CategoryPieChart />)

    expect(
      await screen.findByText(/no expenses for selected period/i),
    ).toBeInTheDocument()
  })

  it('shows error state when request fails', async () => {
    server.use(
      http.get(
        `${API_URL}/statistics/spending-by-category`,
        () =>
          new HttpResponse(null, {
            status: 500,
          }),
      ),
    )

    renderWithProviders(<CategoryPieChart />)

    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument()
  })
})
