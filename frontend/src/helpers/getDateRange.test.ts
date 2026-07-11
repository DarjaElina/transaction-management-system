import { getDateRange } from './getDateRange'

describe('getDateRange', () => {
  it('returns week period for last 90 days', () => {
    const result = getDateRange('last_90_days')

    expect(result.period).toBe('week')
  })

  it('returns month period for this year', () => {
    const result = getDateRange('this_year')

    expect(result.period).toBe('month')
  })
})
