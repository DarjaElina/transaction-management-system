import { createTransaction } from '@/api/transactions'
import type { Transaction } from '@/types/transactions.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const useCreateTransaction = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createTransaction,

    onSuccess: (newTransaction) => {
      queryClient.setQueryData(['transactions'], (old: Transaction[] = []) => [
        ...old,
        newTransaction,
      ])
    },
  })
}
