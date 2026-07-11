import { formatChartLabel } from './formatChartLabel'

describe('formatChartLabel', () => {
  it('formats day ranges correctly', () => {
    expect(formatChartLabel('2026-07-08T00:00:00', 'last_7_days')).toBe('Wed 8')
  })

  it('formats yearly ranges as year', () => {
    expect(formatChartLabel('2026-01-01T00:00:00', 'all_time')).toBe('2026')
  })
})
