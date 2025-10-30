'use client'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const dateOptions = [
  {
    value: '2025-10-31',
    label: '10월 31일',
  },
  {
    value: '2025-10-30',
    label: '10월 30일',
  },
]

interface Props {
  container?: Element | DocumentFragment | null
  date: string
  setDate: React.Dispatch<React.SetStateAction<string>>
}

const DateSelect = ({ container, date, setDate }: Props) => {
  const selectedDate = dateOptions.find((t) => t.value === date)

  return (
    <Select
      value={date}
      onValueChange={(value) => {
        setDate(value)
      }}
    >
      <SelectTrigger className="w-[120px]">
        <SelectValue>
          {selectedDate && <span>{selectedDate.label}</span>}
        </SelectValue>
      </SelectTrigger>
      <SelectContent position="popper" container={container}>
        <SelectGroup>
          {dateOptions.map((option) => (
            <SelectItem value={option.value} key={option.value}>
              <span>{option.label}</span>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default DateSelect
