import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Combobox,
  ComboboxContent,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from './ui/combobox'
import { useState } from 'react'
import { createCategory, getCategories } from '@/api/categories'
import useDebounce from '@/hooks/useDebounce'
import { PlusIcon } from 'lucide-react'
import type { Category } from '@/types/categories.types'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Field, FieldGroup, FieldLabel } from './ui/field'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { getCategoriesStatus } from '@/helpers'
import { toast } from 'sonner'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
interface CategoryListProps {
  container?: HTMLElement | null
  onFocus: () => void
  selectedCategory: Category
  setSelectedCategory: (category: Category) => void
}

export function CategoryList({
  container,
  onFocus,
  selectedCategory,
  setSelectedCategory,
}: CategoryListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [allowedType, setAllowedType] = useState('income')

  const queryClient = useQueryClient()

  const { data, isError, error, isFetching } = useQuery({
    queryKey: ['categories', debouncedSearchTerm],
    queryFn: () => getCategories({ name: debouncedSearchTerm }),
    enabled: Boolean(debouncedSearchTerm),
  })

  const { isPending, mutate } = useMutation({
    mutationFn: createCategory,
    onSuccess: (newCategory) => {
      setSelectedCategory(newCategory)

      setDialogOpen(false)

      queryClient.setQueryData(
        ['categories'],
        (oldCategories: Category[] = []) => [...oldCategories, newCategory],
      )
      setSearchTerm('')
      setAllowedType('income')
    },
  })

  const trimmedSearchTerm = searchTerm.trim()

  const lowered = trimmedSearchTerm.toLocaleLowerCase()

  const exactExists = data?.some(
    (c) => c.name.trim().toLocaleLowerCase() === lowered,
  )

  const categoriesForView: Category[] | undefined =
    data && trimmedSearchTerm !== '' && !exactExists
      ? [
          ...data,
          {
            name: trimmedSearchTerm,
            creatable: true,
            id: `create:${trimmedSearchTerm}`,
          },
        ]
      : data

  const handleSubmit = () => {
    mutate(
      {
        name: selectedCategory?.name,
        allowed_type: allowedType,
      },
      {
        onError: (e) => {
          toast.error(e?.message ?? 'Something went wrong 🥲')
        },
        onSuccess: (category: Category) => {
          toast.success(`Category ${category.name} created successfully!`)
        },
      },
    )
  }

  return (
    <>
      <Combobox
        value={selectedCategory}
        items={categoriesForView}
        itemToStringLabel={(category: Category) => category.name}
        filter={null}
        onValueChange={(nextSelectedCategory) => {
          const creatableSelection = nextSelectedCategory?.creatable

          if (creatableSelection) {
            setSelectedCategory(nextSelectedCategory)
            setDialogOpen(true)
            return
          }

          if (nextSelectedCategory) {
            console.log(nextSelectedCategory)
            setSelectedCategory(nextSelectedCategory)
          } else {
            setSelectedCategory({
              id: '',
              name: '',
              creatable: false,
              allowed_type: undefined,
            })
          }
        }}
        onInputValueChange={(nextSearchTerm) => {
          setSearchTerm(nextSearchTerm)
        }}
      >
        <ComboboxInput
          placeholder="Select a category or create new"
          showClear
          onFocus={onFocus}
        />

        <ComboboxContent container={container}>
          {getCategoriesStatus(
            isFetching,
            isError,
            error,
            trimmedSearchTerm,
          ) && (
            <div className="px-3 py-2 text-sm text-muted-foreground">
              {getCategoriesStatus(
                isFetching,
                isError,
                error,
                trimmedSearchTerm,
              )}
            </div>
          )}
          <ComboboxList>
            {(category) =>
              category.creatable ? (
                <ComboboxItem key={category.id} value={category}>
                  <span>
                    <PlusIcon />
                  </span>
                  Create "{category.name}"
                </ComboboxItem>
              ) : (
                <ComboboxItem key={category.id} value={category}>
                  {category.name}
                </ComboboxItem>
              )
            }
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>New category</DialogTitle>
            <DialogDescription>
              Confirm or edit category name.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                name="category"
                onChange={(e) => {
                  setSelectedCategory({
                    ...selectedCategory,
                    name: e.target.value,
                  })
                }}
                value={selectedCategory?.name}
              />
            </Field>
            <Field>
              <RadioGroup
                value={allowedType}
                onValueChange={(v) => setAllowedType(v)}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="income" id="income" />
                  <FieldLabel htmlFor="income">Income</FieldLabel>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="expense" id="expense" />
                  <FieldLabel htmlFor="expense">Expense</FieldLabel>
                </div>
              </RadioGroup>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button disabled={isPending} onClick={handleSubmit}>
              {isPending ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
