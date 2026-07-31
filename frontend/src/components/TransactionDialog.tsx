import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { DatePicker } from './DatePicker'
import { useForm } from '@tanstack/react-form'
import { createTransactionSchema } from '@/schemas/transactions'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction, editTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useEffect, useRef, useState } from 'react'
import { CategoryList } from './CategoryList'
import type { Category } from '@/types/categories.types'
import { Plus } from 'lucide-react'
import { getErrorMessage } from '@/helpers'

interface TransactionDialogProps {
  mode: 'edit' | 'create'
  existing?: Transaction
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
  setDropdownOpen?: React.Dispatch<React.SetStateAction<boolean>>
}

export function TransactionDialog({
  mode,
  existing,
  dialogOpen,
  setDialogOpen,
  setDropdownOpen,
}: TransactionDialogProps) {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<Category>({
    id: '',
    name: '',
    creatable: false,
    allowed_type: undefined,
  })

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: (newTransaction) => {
      setSelectedCategory({
        id: '',
        name: '',
        creatable: false,
        allowed_type: undefined,
      })
      queryClient.setQueryData(
        ['transactions'],
        (oldTransactions: Transaction[] = []) => [
          ...oldTransactions,
          newTransaction,
        ],
      )
    },
  })

  const { isPending: isEditPending, mutate: mutateEdit } = useMutation({
    mutationFn: editTransaction,
    onSuccess: (newTransaction) => {
      setSelectedCategory({
        id: '',
        name: '',
        creatable: false,
        allowed_type: undefined,
      })
      queryClient.setQueryData(
        ['transactions'],
        (oldTransactions: Transaction[]) =>
          oldTransactions.map((t) =>
            t.id === newTransaction.id ? newTransaction : t,
          ),
      )
    },
  })

  const form = useForm({
    defaultValues: existing
      ? {
          amount: String(existing.amount),
          description: existing.description,
          date: new Date(existing.date),
        }
      : {
          amount: '',
          description: '',
          date: new Date(),
        },
    validators: {
      onSubmit: createTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      if (!selectedCategory.allowed_type) {
        toast.error('Please select a category')
        return
      }
      if (mode === 'create') {
        mutate(
          {
            ...value,
            amount: Number(value.amount),
            transaction_type: selectedCategory.allowed_type,
            category_id: selectedCategory.id,
          },
          {
            onError: (e) => {
              toast.error(getErrorMessage(e))
            },
            onSuccess: () => {
              setDialogOpen(false)
              form.reset()
              toast.success('Transaction created succesfully! 🦄')
            },
          },
        )
      } else if (existing && existing.id) {
        mutateEdit(
          {
            ...value,
            amount: Number(value.amount),
            id: existing.id,
            transaction_type: selectedCategory.allowed_type,
            category_id: selectedCategory.id,
          },
          {
            onError: (e) => {
              toast.error(e?.message ?? 'Something went wrong 🥲')
            },
            onSuccess: () => {
              if (setDropdownOpen) {
                setDropdownOpen(false)
              }
              setDialogOpen(false)
              form.reset()
              toast.success('Transaction updated succesfully! 🦄')
            },
          },
        )
      }
    },
  })

  const handleCancel = () => {
    if (setDropdownOpen) {
      setDropdownOpen(false)
    }
    setDialogOpen(false)
  }

  useEffect(() => {
    const setExistingCategory = () => {
      if (existing) {
        setSelectedCategory(existing.category)
      }
    }
    if (existing) {
      form.reset({
        amount: String(existing.amount),
        description: existing.description,
        date: new Date(existing.date),
      })
    }
    setExistingCategory()
  }, [existing, form])

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      {mode === 'create' && (
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus />
            Add Transaction
          </Button>
        </DialogTrigger>
      )}
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Create new transaction' : 'Edit transaction'}
          </DialogTitle>
          <DialogDescription className="sr-only"></DialogDescription>
        </DialogHeader>
        <form
          id="transactions-form"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="amount"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                    <Input
                      autoFocus
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="10.50"
                      autoComplete="off"
                      type="number"
                      min={0.1}
                      step={0.01}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Example description"
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <CategoryList
              container={container}
              onFocus={() => {
                if (contentRef.current) {
                  setContainer(contentRef.current)
                }
              }}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />

            {selectedCategory.allowed_type && (
              <Field data-disabled>
                <FieldLabel htmlFor="transaction_type">
                  Transaction type
                </FieldLabel>
                <Input
                  id="transaction_type"
                  disabled
                  readOnly
                  value={selectedCategory.allowed_type}
                />
                <FieldDescription>
                  Transaction type is preselected based on category allowed
                  type.
                </FieldDescription>
              </Field>
            )}

            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <DatePicker
                      isInvalid={isInvalid}
                      id={field.name}
                      date={field.state.value}
                      setDate={(date) => field.handleChange(date)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />
          </FieldGroup>
        </form>
        <DialogFooter>
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button disabled={isPending} type="submit" form="transactions-form">
            {isPending || isEditPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
