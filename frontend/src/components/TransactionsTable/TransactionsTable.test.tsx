import { screen } from '@testing-library/react'
import type { Transaction } from '@/types/transactions.types'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { columns } from './Columns'
import { TransactionsTable } from './TransactionsTable'
import { renderWithProviders } from '@/helpers/tests.helpers'

export const mockTransactions: Transaction[] = [
  {
    id: '1',
    date: new Date('2025-10-04'),
    description: 'Coffee',
    amount: 4.5,
    transaction_type: 'expense',
    category: { id: '1', name: 'Food' },
  },
  {
    id: '1',
    date: new Date('2025-10-01'),
    description: 'Cat snacks',
    amount: 100,
    transaction_type: 'expense',
    category: { id: '1', name: 'Pets' },
  },
  {
    id: '2',
    date: new Date('2025-10-05'),
    description: 'New keyboard',
    amount: 1,
    transaction_type: 'expense',
    category: { id: '2', name: 'Computers' },
  },
  {
    id: '3',
    date: new Date('2025-10-03'),
    description: 'Pilates mat',
    amount: 11.8,
    transaction_type: 'expense',
    category: { id: '1', name: 'Sport' },
  },
]

describe('TransactionsTable', () => {
  it('renders rows from provided data', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const description = await screen.findByText(/coffee/i)
    const formattedAmount = await screen.findByText(/4,50\s?€/)
    const category = await screen.findByText(/food/i)

    expect(description).toBeInTheDocument()
    expect(formattedAmount).toBeInTheDocument()
    expect(category).toBeInTheDocument()
  })

  it('renders table headers', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const dateHeader = await screen.findByText(/date/i)
    const descriptionHeader = await screen.findByText(/description/i)
    const categoryHeader = await screen.findByText(/category/i)
    const typeHeader = await screen.findByText(/type/i)
    const amountHeader = await screen.findByText(/amount/i)

    expect(dateHeader).toBeInTheDocument()
    expect(descriptionHeader).toBeInTheDocument()
    expect(categoryHeader).toBeInTheDocument()
    expect(typeHeader).toBeInTheDocument()
    expect(amountHeader).toBeInTheDocument()
  })

  it("shows 'No results' when data is empty", async () => {
    renderWithProviders(<TransactionsTable columns={columns} data={[]} />)

    const emptyMessage = await screen.findByText(/no results/i)
    expect(emptyMessage).toBeInTheDocument()
  })

  it('filters rows based on description input', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const user = userEvent.setup()

    const searchBar = await screen.findByPlaceholderText(
      /filter by description/i,
    )

    await user.type(searchBar, 'coffee')

    const description1 = await screen.findByText(
      mockTransactions[0].description,
    )
    expect(description1).toBeInTheDocument()

    const description2 = screen.queryByText(mockTransactions[1].description)
    expect(description2).toBeNull()
  })

  it('sorts rows when clicking on a sortable date column', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const user = userEvent.setup()

    // unsorted by default
    let rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/Sat Oct 04 2025/)
    const dateHeader = await screen.findByText(/date/i)
    await user.click(dateHeader)

    // change sorting to ascending - expect oldest transaction to be first
    const asc = await screen.findByText('Asc')
    await user.click(asc)
    rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/Wed Oct 01 2025/)

    // change sorting to desc
    await user.click(dateHeader)
    const desc = await screen.findByText('Desc')
    await user.click(desc)
    rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/Sun Oct 05 2025/)
  })

  it('sorts rows when clicking on a sortable amount column', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const user = userEvent.setup()

    let rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/4,50\s?€/)
    const amountHeader = await screen.findByText(/amount/i)
    await user.click(amountHeader)

    const asc = await screen.findByText('Asc')
    await user.click(asc)
    rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/1,00\s?€/)

    await user.click(amountHeader)
    const desc = await screen.findByText('Desc')
    await user.click(desc)
    rows = screen.getAllByRole('rowgroup')
    expect(rows[1]).toHaveTextContent(/100,00\s?€/)
  })

  it('toggles column visibility', async () => {
    renderWithProviders(
      <TransactionsTable columns={columns} data={mockTransactions} />,
    )

    const user = userEvent.setup()

    await user.click(await screen.findByText(/view/i))
    await user.click(
      await screen.findByRole('menuitemcheckbox', { name: /category/i }),
    )

    let categoryCell = screen.queryByText(/food/i)

    expect(categoryCell).toBeNull()

    // toggle back
    await user.click(await screen.findByText(/view/i))
    await user.click(
      await screen.findByRole('menuitemcheckbox', { name: /category/i }),
    )

    categoryCell = await screen.findByText(/food/i)

    expect(categoryCell).toBeInTheDocument()
  })
})
