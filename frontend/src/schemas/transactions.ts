import * as z from 'zod'

export const createTransactionSchema = z.object({
  amount: z.string('Amount is required'),
  description: z
    .string()
    .min(5, 'Description must be at least 5 characters.')
    .max(100, 'Description must be at most 100 characters.'),
  transaction_type: z.string(), // change to proper enum later,
  date: z.date(),
  category_id: z.string().min(1, 'Category is required'),
})

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(5, 'Category must be at least 5 characters.')
    .max(20, 'Category must be at most 100 characters.'),
  allowed_type: z.string(), // change to proper enum later,
})
