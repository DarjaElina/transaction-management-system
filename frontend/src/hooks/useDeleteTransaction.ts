import { deleteTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useQueryClient, useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteTransaction,

    onMutate: async (transactionId) => {
      const previousTransactions = queryClient.getQueryData<Transaction[]>([
        'transactions',
      ])

      queryClient.setQueryData(['transactions'], (old: Transaction[] = []) =>
        old.filter((t) => t.id !== transactionId),
      )

      return {
        previousTransactions,
      }
    },

    onSuccess: () => {
      toast.success('Transaction deleted successfully 🗑️')
    },

    onError: (_, __, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions)
      toast.error('Failed to delete 🥲')
    },
  })
}
