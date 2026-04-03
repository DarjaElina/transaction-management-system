import type { createTransactionSchema } from '@/schemas/transactions'
import * as z from 'zod'

export interface Transaction {
  id: string
  date: Date
  description: string
  transaction_type: 'income' | 'expence'
  amount: number
}

export type CreateTransactionType = z.infer<typeof createTransactionSchema> & {
  category_id: number
}
