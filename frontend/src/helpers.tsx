import React from 'react'
import type { ApiTransaction, Transaction } from './types/transactions.types'
import { AxiosError } from 'axios'

export const getCategoriesStatus = (
  isFetching: boolean,
  isError: boolean,
  error: Error | null,
  trimmedSearchTerm: string,
) => {
  if (isFetching) {
    return (
      <React.Fragment>
        <span aria-hidden />
        Searching…
      </React.Fragment>
    )
  }

  if (isError) {
    return error?.message
  }

  if (trimmedSearchTerm === '') {
    return 'Start typing to search categories...'
  }

  return null
}

export const mapTransactions = (
  apiTxs: ApiTransaction[] | undefined,
): Transaction[] => {
  if (!apiTxs) return []

  return apiTxs.map((t) => ({
    ...t,
    amount: Number(t.amount),
  }))
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError) {
    return error.response?.data?.error?.message ?? error.message
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Something went wrong 🥲'
}
