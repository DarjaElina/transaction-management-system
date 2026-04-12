import type { createTransactionSchema } from '@/schemas/transactions'
import * as z from 'zod'

export interface Transaction {
  id: string
  date: Date
  description: string
  transaction_type: 'income' | 'expense'
  amount: number
  category: {
    id: string
    name: string
  }
}

export type CreateTransactionType = z.infer<typeof createTransactionSchema> & {
  category_id: string
  transaction_type: string
}

export type EditTransactionType = CreateTransactionType & {
  id: string
}
