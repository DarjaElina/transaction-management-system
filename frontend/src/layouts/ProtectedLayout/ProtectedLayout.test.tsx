import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router'
import ProtectedLayout from './ProtectedLayout'

import { useCurrentUser } from '@/hooks/useCurrentUser'
import { renderWithProviders } from '@/helpers/tests.helpers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

vi.mock('@/hooks/useCurrentUser', () => ({
  useCurrentUser: vi.fn(),
}))

describe('ProtectedLayout', () => {
  it('shows spinner while loading user', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    } as never)

    renderWithProviders(<ProtectedLayout />)

    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('redirects to login when user is missing', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: null,
    } as never)

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/transactions']}>
          <Routes>
            <Route element={<ProtectedLayout />}>
              <Route path="/transactions" element={<div>Transactions</div>} />
            </Route>

            <Route path="/login" element={<div>Login page</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Login page')).toBeInTheDocument()
  })

  it('renders protected content for authenticated user', () => {
    vi.mocked(useCurrentUser).mockReturnValue({
      data: {
        id: '1',
        email: 'test@test.com',
        first_name: 'John',
        last_name: 'Doe',
      },
      isLoading: false,
      error: null,
    } as never)

    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
        mutations: {
          retry: false,
        },
      },
    })

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <Routes>
            <Route element={<ProtectedLayout />}>
              <Route path="/" element={<div>Secret content</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    expect(screen.getByText('Secret content')).toBeInTheDocument()
  })
})
