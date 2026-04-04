import { useQuery } from '@tanstack/react-query'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox'
import { useState } from 'react'
import { getCategories } from '@/api/categories'
import React from 'react'

interface Category {
  id: number
  name: string
}

interface CategoryListProps {
  container?: HTMLElement | null
  onFocus: () => void
  id: string
}

export function CategoryList({ container, onFocus, id }: CategoryListProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  )

  const { data, isError, error, isFetching } = useQuery({
    queryKey: ['categories', searchTerm],
    queryFn: () => getCategories({ name: searchTerm }),
    enabled: Boolean(searchTerm),
  })

  const trimmedSearchTerm = searchTerm.trim()

  const getStatus = () => {
    if (isFetching) {
      return (
        <React.Fragment>
          <span aria-hidden />
          Searching…
        </React.Fragment>
      )
    }

    if (isError) {
      return error.message
    }

    if (trimmedSearchTerm === '' && !selectedCategory) {
      return 'Start typing to search categories...'
    }

    if (data?.length === 0) {
      return `No matches for "${trimmedSearchTerm}".`
    }

    return null
  }

  return (
    <Combobox
      open={open}
      onOpenChange={setOpen}
      items={data}
      itemToStringLabel={(category: Category) => category.name}
      filter={null}
      onValueChange={(nextSelectedCategory) => {
        setSelectedCategory(nextSelectedCategory)
        setSearchTerm('')
      }}
      onInputValueChange={(nextSearchTerm) => {
        setSearchTerm(nextSearchTerm)
      }}
    >
      <ComboboxInput
        placeholder="Select a category or create new"
        showClear
        onFocus={onFocus}
        id={id}
      />
      <ComboboxContent container={container}>
        {getStatus() && (
          <div className="px-3 py-2 text-sm text-muted-foreground">
            {getStatus()}
          </div>
        )}
        <ComboboxList>
          {(category) => (
            <ComboboxItem key={category.id} value={category}>
              {category.name}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
