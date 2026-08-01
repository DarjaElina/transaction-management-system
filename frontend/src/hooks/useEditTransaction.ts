import { editTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useEditTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: editTransaction,

    onSuccess: (updatedTransaction) => {
      queryClient.setQueryData(['transactions'], (old: Transaction[] = []) =>
        old.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? updatedTransaction
            : transaction,
        ),
      )
    },
  })
}
