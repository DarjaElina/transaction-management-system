import type {
  ApiTransaction,
  CreateTransactionType,
  EditTransactionType,
  Transaction,
} from '@/types/transactions.types'
import { api } from './client'

export const getTransactons = async (): Promise<ApiTransaction[]> => {
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

export const editTransaction = async (transaction: EditTransactionType) => {
  const { data } = await api.patch(`/transactions/${transaction.id}`, {
    amount: transaction.amount,
    category_id: transaction.category_id,
    date: transaction.date,
    transaction_type: transaction.transaction_type,
    description: transaction.description,
  })
  return data
}
