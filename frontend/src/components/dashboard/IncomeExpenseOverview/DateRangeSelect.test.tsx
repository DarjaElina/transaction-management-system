import { screen } from '@testing-library/react'
import DateRangeSelect from './DateRangeSelect'
import userEvent from '@testing-library/user-event'
import { renderWithProviders } from '@/helpers/testHelpers'

const onChange = vi.fn()

window.HTMLElement.prototype.hasPointerCapture = vi.fn()

window.HTMLElement.prototype.scrollIntoView = vi.fn()

describe('DateRangeSelect', () => {
  it('renders all options', async () => {
    renderWithProviders(
      <DateRangeSelect value="all_time" onChange={onChange} />,
    )

    const user = userEvent.setup()

    await user.click(screen.getByRole('combobox'))

    expect(await screen.findByText('Last 7 days')).toBeInTheDocument()

    expect(await screen.findByText('This year')).toBeInTheDocument()
  })

  it('calls onChange when option selected', async () => {
    renderWithProviders(
      <DateRangeSelect value="all_time" onChange={onChange} />,
    )

    const user = userEvent.setup()

    await user.click(screen.getByRole('combobox'))

    await user.click(await screen.findByText('Last 30 days'))

    expect(onChange).toHaveBeenCalledWith('last_30_days')
  })
})
