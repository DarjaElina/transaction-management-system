import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { DateRangeOption } from '@/types/statistics.types'

const dateRangeOptions = [
  { label: 'Last 7 days', value: 'last_7_days' },
  { label: 'Last 30 days', value: 'last_30_days' },
  { label: 'Last 90 days', value: 'last_90_days' },
  { label: 'This year', value: 'this_year' },
  { label: 'Last year', value: 'last_year' },
  { label: 'All time', value: 'all_time' },
]

interface DateRangeSelectProps {
  value: DateRangeOption
  onChange: React.Dispatch<React.SetStateAction<DateRangeOption>>
}

function DateRangeSelect({ value, onChange }: DateRangeSelectProps) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as DateRangeOption)}>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Select range" />
      </SelectTrigger>

      <SelectContent>
        {dateRangeOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default DateRangeSelect
