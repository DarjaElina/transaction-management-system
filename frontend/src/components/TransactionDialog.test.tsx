import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'

import { TransactionDialog } from './TransactionDialog'
import { renderWithProviders } from '@/helpers/testHelpers'
import type { Transaction } from '@/types/transactions.types'
import { server } from '@/mocks/server'
import { delay, http, HttpResponse } from 'msw'

const mockExistingTransaction: Transaction = {
  id: '1',
  amount: 12.5,
  description: 'Coffee',
  date: new Date('2025-10-04'),
  transaction_type: 'expense',
  category: {
    id: '1',
    name: 'Food',
  },
}

export const openDialog = async () => {
  const user = userEvent.setup()

  await user.click(
    await screen.findByRole('button', {
      name: /add transaction/i,
    }),
  )
}

describe('TransactionDialog', () => {
  it('opens create dialog', async () => {
    renderWithProviders(<TransactionDialog mode="create" />)

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', {
        name: /add transaction/i,
      }),
    )

    const title = await screen.findByText(/create new transaction/i)

    expect(title).toBeInTheDocument()
  })

  it('renders existing transaction values in edit mode', async () => {
    renderWithProviders(
      <TransactionDialog mode="edit" existing={mockExistingTransaction} />,
    )

    const user = userEvent.setup()

    await user.click(
      screen.getByRole('button', {
        name: /edit/i,
      }),
    )

    const amount = await screen.findByDisplayValue('12.5')
    const description = await screen.findByDisplayValue(/coffee/i)

    expect(amount).toBeInTheDocument()
    expect(description).toBeInTheDocument()
  })

  it('submits form successfully and calls create mutation', async () => {
    renderWithProviders(<TransactionDialog mode="create" />)

    await openDialog()

    const user = userEvent.setup()

    await user.type(await screen.findByPlaceholderText('10.50'), '15.99')

    await user.type(
      await screen.findByPlaceholderText(/example description/i),
      'Test Description',
    )

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'Food',
    )

    await user.click(
      await screen.findByRole('option', {
        name: 'Food',
      }),
    )

    await user.click(
      await screen.findByRole('button', {
        name: /save changes/i,
      }),
    )

    await screen.findByText(/saving/i)

    expect(
      await screen.findByText('Transaction created succesfully! 🦄'),
    ).toBeInTheDocument()
  })

  it('shows loading state while submitting', async () => {
    renderWithProviders(<TransactionDialog mode="create" />)

    await openDialog()

    const user = userEvent.setup()

    await user.type(await screen.findByPlaceholderText('10.50'), '15.99')

    await user.type(
      await screen.findByPlaceholderText(/example description/i),
      'Test Description',
    )

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'Food',
    )

    await user.click(
      await screen.findByRole('option', {
        name: 'Food',
      }),
    )

    await user.click(
      await screen.findByRole('button', {
        name: /save changes/i,
      }),
    )

    expect(await screen.findByText(/saving/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /saving/i,
      }),
    ).toBeDisabled()
  })

  it('shows error toast', async () => {
    server.use(
      http.post('http://localhost:8000/transactions', async () => {
        await delay(500)

        return new HttpResponse(null, {
          status: 500,
        })
      }),
    )

    renderWithProviders(<TransactionDialog mode="create" />)

    await openDialog()

    const user = userEvent.setup()

    await user.type(await screen.findByPlaceholderText('10.50'), '15.99')

    await user.type(
      await screen.findByPlaceholderText(/example description/i),
      'Test Description',
    )

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'Food',
    )

    await user.click(
      await screen.findByRole('option', {
        name: 'Food',
      }),
    )

    await user.click(
      await screen.findByRole('button', {
        name: /save changes/i,
      }),
    )

    expect(
      await screen.findByText(/request failed with status code 500/i),
    ).toBeInTheDocument()
  })
})
