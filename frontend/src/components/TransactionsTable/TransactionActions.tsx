import type { Transaction } from '@/types/transactions.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { deleteTransaction } from '@/api/transactions'
import { toast } from 'sonner'
import { TransactionDialog } from '../TransactionDialog'

function TransactionActions({ transaction }: { transaction: Transaction }) {
  const queryClient = useQueryClient()

  const { isPending, mutate } = useMutation({
    mutationFn: deleteTransaction,

    onMutate: async (transactionId: string) => {
      const previousTransaction = queryClient.getQueryData<Transaction[]>([
        'transactions',
      ])

      queryClient.setQueryData(
        ['transactions'],
        (oldTransactions: Transaction[] = []) =>
          oldTransactions.filter((t) => t.id !== transactionId),
      )

      return { previousTransaction }
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransaction)

      toast.error('Failed to delete 🥲')
    },

    onSuccess: () => {
      toast.success('Transaction deleted successfully 🗑️')
    },
  })

  const handleDelete = (transactionId: string) => {
    try {
      toast.warning('Are you sure you want to delete this transaction?', {
        action: {
          label: 'Delete',
          onClick: () => mutate(transactionId),
        },
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancelled...'),
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <TransactionDialog existing={transaction} mode="edit" />

          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(transaction.id)}
          >
            Copy transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onClick={() => handleDelete(transaction.id)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TransactionActions
