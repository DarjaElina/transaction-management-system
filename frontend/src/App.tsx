import { useQuery } from '@tanstack/react-query'
import { TransactionsTable } from './components/TransactionsTable/TransactionsTable'
import { columns } from './components/TransactionsTable/Columns'
import { getTransactons } from './api/transactions'
import { Toaster } from '@/components/ui/sonner'

function App() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactons,
  })

  if (result.isLoading) {
    return <p>Loading transactions...</p>
  }

  const transactions = result.data

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Transactions</h1>
        </div>

        {transactions && (
          <div className="bg-background rounded-xl border p-6">
            <TransactionsTable columns={columns} data={transactions} />
          </div>
        )}
        <Toaster />
      </div>
    </div>
  )
}

export default App
