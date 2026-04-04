import type { createTransactionSchema } from '@/schemas/transactions'
import * as z from 'zod'

export interface Transaction {
  id: string
  date: Date
  description: string
  transaction_type: 'income' | 'expence'
  amount: number
  category: {
    id: number
    name: string
  }
}

export type CreateTransactionType = Omit<
  z.infer<typeof createTransactionSchema> & {
    category_id: number
  },
  'category'
> & {
  category_id: number
}
