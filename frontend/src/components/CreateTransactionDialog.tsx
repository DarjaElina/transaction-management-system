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
  FieldLegend,
  FieldSet,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Plus } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { DatePicker } from './DatePicker'
import { useForm } from '@tanstack/react-form'
import { createTransactionSchema } from '@/schemas/transactions'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useState } from 'react'

export function CreateTransactionDialog() {
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
    },
    validators: {
      onSubmit: createTransactionSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          ...value,
          category_id: 1,
        },
        {
          onError: (e) => {
            toast.error(e?.message ?? 'Something went wrong 🥲')
          },
          onSuccess: () => {
            setOpen(false)
            toast.success('Transaction created succesfully! 🦄')
          },
        },
      )
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus />
          Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Create new transaction</DialogTitle>
          <DialogDescription>Something here?</DialogDescription>
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
              name="transaction_type"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <FieldSet>
                    <FieldLegend>Transaction Type</FieldLegend>
                    <Field data-invalid={isInvalid}>
                      <RadioGroup
                        name={field.name}
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="income"
                            id="income"
                            aria-invalid={isInvalid}
                          />
                          <FieldLabel htmlFor="income">Income</FieldLabel>
                        </div>
                        <div className="flex items-center gap-3">
                          <RadioGroupItem
                            value="expense"
                            id="expense"
                            aria-invalid={isInvalid}
                          />
                          <FieldLabel htmlFor="expense">Expense</FieldLabel>
                        </div>
                      </RadioGroup>
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  </FieldSet>
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
              name="date"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Date</FieldLabel>
                    <DatePicker
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
