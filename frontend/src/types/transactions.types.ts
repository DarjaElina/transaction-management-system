import type { createTransactionSchema } from '@/schemas/transactions'
import * as z from 'zod'

export interface Transaction {
  id: string
  date: Date
  description: string
  transaction_type: 'income' | 'expence'
  amount: number
  category: {
    id: string
    name: string
  }
}

export type CreateTransactionType = Omit<
  z.infer<typeof createTransactionSchema> & {
    category_id: string
  },
  'category'
> & {
  category_id: string
}
