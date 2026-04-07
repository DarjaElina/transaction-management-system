import { createCategorySchema } from '@/schemas/transactions'
import * as z from 'zod'

export type CategoryCreate = z.infer<typeof createCategorySchema>

export type Category = {
  id: string
  name: string
  allowed_type?: 'income' | 'expense'
  creatable?: boolean
}
