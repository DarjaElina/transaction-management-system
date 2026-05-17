import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'

import { CategoryList } from './CategoryList'
import { renderWithProviders } from '@/helpers/testHelpers'
import { server } from '@/mocks/server'

const setup = (props = {}) => {
  const selectedCategory = {
    id: '',
    name: '',
    creatable: true,
  }

  const setSelectedCategory = vi.fn()

  renderWithProviders(
    <CategoryList
      container={document.body}
      onFocus={vi.fn()}
      selectedCategory={selectedCategory}
      setSelectedCategory={setSelectedCategory}
      {...props}
    />,
  )

  return {
    user: userEvent.setup(),
    setSelectedCategory,
  }
}

describe('TransactionDialog', () => {
  it('renders combobox input', () => {
    setup()

    expect(
      screen.getByPlaceholderText(/select a category or create new/i),
    ).toBeInTheDocument()
  })

  it('loads categories when typing search', async () => {
    const { user } = setup()

    const input = screen.getByPlaceholderText(
      /select a category or create new/i,
    )

    await user.type(input, 'foo')

    expect(await screen.findByText('Food')).toBeInTheDocument()
  })

  it('opens create category dialog when creatable option selected', async () => {
    const { user } = setup()

    const input = screen.getByPlaceholderText(
      /select a category or create new/i,
    )

    await user.type(input, 'New Category')

    await user.click(await screen.findByText(/create/i))

    expect(await screen.findByText(/new category/i)).toBeInTheDocument()
  })

  it('creates category successfully', async () => {
    const { user, setSelectedCategory } = setup()

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'New',
    )

    await user.click(await screen.findByRole('option', { name: /new/i }))

    await user.click(
      await screen.findByRole('button', { name: /save changes/i }),
    )

    expect(setSelectedCategory).toHaveBeenCalledWith({
      creatable: true,
      id: 'create:New',
      name: 'New',
    })

    expect(await screen.findByText(/created successfully/i)).toBeInTheDocument()
  })

  it('shows loading state while creating category', async () => {
    const { user } = setup()

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'New',
    )

    await user.click(await screen.findByRole('option', { name: /new/i }))

    await user.click(
      await screen.findByRole('button', { name: /save changes/i }),
    )

    expect(await screen.findByText(/saving/i)).toBeInTheDocument()

    expect(
      screen.getByRole('button', {
        name: /saving/i,
      }),
    ).toBeDisabled()
  })

  it('shows error toast on create failure', async () => {
    server.use(
      http.post('http://localhost:8000/categories', async () => {
        return new HttpResponse(null, {
          status: 500,
        })
      }),
    )

    const { user } = setup()

    await user.type(
      await screen.findByPlaceholderText(/select a category or create new/i),
      'New',
    )

    await user.click(await screen.findByRole('option', { name: /new/i }))

    await user.click(
      await screen.findByRole('button', { name: /save changes/i }),
    )

    expect(
      await screen.findByText(/request failed with status code 500/i),
    ).toBeInTheDocument()
  })
})
