import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { DatePicker } from './DatePicker'
import { useForm } from '@tanstack/react-form'
import { createTransactionSchema } from '@/schemas/transactions'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useRef, useState } from 'react'
import { CategoryList } from './CategoryList'
import type { Category } from '@/types/categories.types'

export function CreateTransactionDialog() {
  const contentRef = useRef<HTMLDivElement | null>(null)
  const [container, setContainer] = useState<HTMLDivElement | null>(null)

  const queryClient = useQueryClient()
  const { isPending, mutate } = useMutation({
    mutationFn: createTransaction,
    onSuccess: (newTransaction) => {
      queryClient.setQueryData(
        ['transactions'],
        (oldTransactions: Transaction[]) => [
          ...oldTransactions,
          newTransaction,
        ],
      )
    },
  })
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      amount: '',
      transaction_type: '',
      description: '',
      date: new Date(),
      category_id: '',
    },
    validators: {
      onSubmit: createTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onError: (e) => {
          toast.error(e?.message ?? 'Something went wrong 🥲')
        },
        onSuccess: () => {
          handleClearCategory()
          setOpen(false)
          form.reset()
          toast.success('Transaction created succesfully! 🦄')
        },
      })
    },
  })

  const handleClearCategory = () => {
    form.resetField('category_id')
    form.resetField('transaction_type')
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent ref={contentRef}>
        <DialogHeader>
          <DialogTitle>Create new transaction</DialogTitle>
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

            <form.Field
              name="category_id"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Category</FieldLabel>
                    <CategoryList
                      inputId={field.name}
                      container={container}
                      onFocus={() => {
                        if (contentRef.current) {
                          setContainer(contentRef.current)
                        }
                      }}
                      onCategorySelect={(category: Category) => {
                        if (category.id) {
                          field.handleChange(category.id)
                        }
                        if (category.allowed_type) {
                          form.setFieldValue(
                            'transaction_type',
                            category.allowed_type,
                          )
                        }
                      }}
                      onCategoryClear={handleClearCategory}
                      dataInvalid={isInvalid}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            />

            <form.Field
              name="transaction_type"
              children={(field) => {
                if (field.state.value === '') return null

                return (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Transaction Type
                    </FieldLabel>
                    <Input
                      readOnly
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                    />
                  </Field>
                )
              }}
            />

            <form.Field
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <DatePicker
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
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button disabled={isPending} type="submit" form="transactions-form">
            {isPending ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
