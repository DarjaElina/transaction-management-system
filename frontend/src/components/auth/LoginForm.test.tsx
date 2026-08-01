import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import LoginForm from './LoginForm'
import { renderWithProviders } from '@/helpers/tests.helpers'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router'
import { server } from '@/mocks/server'
import { API_URL } from '@/mocks/config'

describe('LoginForm', () => {
  it('renders login form', () => {
    renderWithProviders(<LoginForm />)

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()

    expect(
      screen.getByLabelText('Password', { exact: true }),
    ).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    ).toBeInTheDocument()
  })

  it('logs in and redirects to transactions', async () => {
    const user = userEvent.setup()

    render(
      <QueryClientProvider
        client={
          new QueryClient({
            defaultOptions: {
              queries: {
                retry: false,
              },
              mutations: {
                retry: false,
              },
            },
          })
        }
      >
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginForm />} />

            <Route path="/transactions" element={<div>Transactions</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await user.type(screen.getByLabelText(/email/i), 'john@test.com')

    await user.type(
      screen.getByLabelText('Password', { exact: true }),
      'Password123!',
    )

    await user.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    )

    expect(screen.getByText('Transactions')).toBeInTheDocument()
  })

  it('shows login error', async () => {
    server.use(
      http.post(`${API_URL}/auth/login`, () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Incorrect email or password',
            },
          },
          {
            status: 401,
          },
        )
      }),
    )

    const user = userEvent.setup()

    renderWithProviders(<LoginForm />)

    await user.type(screen.getByLabelText(/email/i), 'wrong@test.com')

    await user.type(
      screen.getByLabelText('Password', { exact: true }),
      'wrong-password',
    )

    await user.click(
      screen.getByRole('button', {
        name: /sign in/i,
      }),
    )

    expect(
      await screen.findByText(/incorrect email or password/i),
    ).toBeInTheDocument()
  })
})
