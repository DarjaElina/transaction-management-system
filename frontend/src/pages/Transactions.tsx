import { TransactionRowSkeleton } from '@/components/TransactionRowSkeleton'
import { columns } from '@/components/TransactionsTable/Columns'
import { TransactionsTable } from '@/components/TransactionsTable/TransactionsTable'
import type { Transaction } from '@/types/transactions.types'

interface TransactionsProps {
  transactions: Transaction[]
  loading: boolean
  error: Error | null
}

function Transactions({ transactions, error, loading }: TransactionsProps) {
  console.log('TRANSACTIONS ARE', transactions)
  return (
    <div>
      <div className="mb-8 flex">
        <h1 className="text-3xl font-semibold">Transactions</h1>
      </div>

      <div className="bg-background rounded-xl border p-6">
        {error && <p className="text-rose-500">Something went wrong 😿</p>}

        {loading && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <TransactionRowSkeleton key={i} />
            ))}
          </div>
        )}

        {!loading && !error && (
          <TransactionsTable columns={columns} data={transactions} />
        )}
      </div>
    </div>
  )
}

export default Transactions
