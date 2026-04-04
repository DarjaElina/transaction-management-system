import * as z from 'zod'

export const createTransactionSchema = z.object({
  amount: z.string(),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters.')
    .max(100, 'Description must be at most 100 characters.'),
  transaction_type: z.string(), // change to proper enum later,
  date: z.date(),
  category_id: z.number(),
})
