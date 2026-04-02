import type { Transaction } from '@/types/transactions.types'
import { api } from './client'

export const getTransactons = async (): Promise<Transaction[]> => {
  const { data } = await api.get('/transactions')
  return data
}
