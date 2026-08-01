import { deleteTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useQueryClient, useMutation } from '@tanstack/react-query'

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

    onError: (_, __, context) => {
      queryClient.setQueryData(['transactions'], context?.previousTransactions)
    },
  })
}
