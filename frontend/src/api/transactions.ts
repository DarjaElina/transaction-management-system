import type {
  CreateTransactionType,
  Transaction,
} from '@/types/transactions.types'
import { api } from './client'

export const getTransactons = async (): Promise<Transaction[]> => {
  const { data } = await api.get('/transactions')
  return data
}

export const createTransaction = async (
  newTransaction: CreateTransactionType,
): Promise<Transaction> => {
  const { data } = await api.post('/transactions', newTransaction)
  return data
}

export const deleteTransaction = async (
  transactionId: string,
): Promise<{ ok: string }> => {
  const { data } = await api.delete(`/transactions/${transactionId}`)
  return data
}
