import { useQuery } from '@tanstack/react-query'
import { TransactionsTable } from './components/TransactionsTable/TransactionsTable'
import { columns } from './components/TransactionsTable/Columns'
import { getTransactons } from './api/transactions'
import { Toaster } from 'sonner'
import { TransactionRowSkeleton } from './components/TransactionRowSkeleton'

function App() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactons,
  })

  const transactions = result.data

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Transactions</h1>
        </div>

        <div className="bg-background rounded-xl border p-6">
          {transactions && (
            <TransactionsTable columns={columns} data={transactions} />
          )}

          {result.isLoading && (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <TransactionRowSkeleton key={i} />
              ))}
            </div>
          )}
        </div>

        <Toaster richColors />
      </div>
    </div>
  )
}

export default App
