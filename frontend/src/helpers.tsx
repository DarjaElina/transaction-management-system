import React from 'react'
import type { ApiTransaction, Transaction } from './types/transactions.types'

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
