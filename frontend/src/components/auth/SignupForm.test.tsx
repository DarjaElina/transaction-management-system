import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SignupForm from './SignupForm'
import { renderWithProviders } from '@/helpers/tests.helpers'
import { MemoryRouter, Route, Routes } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { server } from '@/mocks/server'
import { http, HttpResponse } from 'msw'
import { API_URL } from '@/mocks/config'

describe('SignupForm', () => {
  it('renders signup form', () => {
    renderWithProviders(<SignupForm />)

    expect(screen.getByText(/create your account/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument()

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()

    expect(
      screen.getByLabelText('Password', { exact: true }),
    ).toBeInTheDocument()

    expect(
      screen.getByLabelText('Confirm password', { exact: true }),
    ).toBeInTheDocument()
  })

  it('creates account and redirects', async () => {
    const user = userEvent.setup()

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
        <MemoryRouter initialEntries={['/signup']}>
          <Routes>
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/transactions" element={<div>Transactions</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    )

    await user.type(screen.getByLabelText(/first name/i), 'John')

    await user.type(screen.getByLabelText(/last name/i), 'Doe')

    await user.type(screen.getByLabelText(/email/i), 'john@test.com')

    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')

    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')

    await user.click(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    )

    expect(screen.getByText('Transactions')).toBeInTheDocument()
  })

  it('shows signup error', async () => {
    server.use(
      http.post(`${API_URL}/auth/signup`, () => {
        return HttpResponse.json(
          {
            error: {
              message: 'Email already exists',
            },
          },
          {
            status: 409,
          },
        )
      }),
    )

    const user = userEvent.setup()

    renderWithProviders(<SignupForm />)

    await user.type(screen.getByLabelText(/first name/i), 'John')

    await user.type(screen.getByLabelText(/last name/i), 'Doe')

    await user.type(screen.getByLabelText(/email/i), 'john@test.com')

    await user.type(screen.getByLabelText(/^password$/i), 'Password123!')

    await user.type(screen.getByLabelText(/confirm password/i), 'Password123!')

    await user.click(
      screen.getByRole('button', {
        name: /create account/i,
      }),
    )

    expect(await screen.findByText(/email already exists/i)).toBeInTheDocument()
  })
})
