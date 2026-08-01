import { transactionTypes } from '@/types/transactions.types'
import * as z from 'zod'

export const createTransactionSchema = z.object({
  amount: z.coerce.number<string>().min(0.1, 'Minimum amount is 0.10'),
  description: z
    .string()
    .min(3, 'Description must be at least 3 characters.')
    .max(100, 'Description must be at most 100 characters.'),
  date: z.date(),
})

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(3, 'Category must be at least 3 characters.')
    .max(20, 'Category must be at most 100 characters.'),
  allowed_type: z.enum(transactionTypes),
})
