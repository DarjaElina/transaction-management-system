import { useQuery } from '@tanstack/react-query'
import { TransactionsTable } from './components/TransactionsTable/TransactionsTable'
import { columns } from './components/TransactionsTable/Columns'
import { getTransactons } from './api/transactions'
import { Toaster } from 'sonner'
import { TransactionRowSkeleton } from './components/TransactionRowSkeleton'
import { ThemeProvider } from './components/ThemeProvider'
import { ModeToggle } from './components/ModeToggle'
import { mapTransactions } from './helpers'

function App() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactons,
  })

  const transactions = result.data ?? []

  const mappedTransactions = mapTransactions(transactions)

  console.log(transactions)

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-muted/40">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <nav className="w-full flex justify-end">
            <ModeToggle />
          </nav>

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

          <Toaster richColors />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default App
