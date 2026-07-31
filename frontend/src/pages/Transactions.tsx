import { getTransactons } from '@/api/transactions'
import { TransactionRowSkeleton } from '@/components/TransactionRowSkeleton'
import { columns } from '@/components/TransactionsTable/Columns'
import { TransactionsTable } from '@/components/TransactionsTable/TransactionsTable'
import { mapTransactions } from '@/helpers'
import { useQuery } from '@tanstack/react-query'

function Transactions() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactons,
  })

  const transactions = result.data ?? []
  const mappedTransactions = mapTransactions(transactions)

  return (
    <div>
      <div className="mb-8 flex">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>

      <div className="bg-background rounded-xl border p-6">
        {result.error && (
          <p className="text-rose-500">Something went wrong 😿</p>
        )}

        {result.isLoading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        )}

        {!result.isLoading && !result.error && (
          <TransactionsTable columns={columns} data={mappedTransactions} />
        )}
      </div>
    </div>
  )
}

export default Transactions
