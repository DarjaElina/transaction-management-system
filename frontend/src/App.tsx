import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { TransactionsTable } from './components/TransactionsTable/TransactionsTable'
import { columns } from './components/TransactionsTable/Columns'

function App() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await axios.get('http://localhost:8000/transactions')
      return response.data
    },
  })

  if (result.isLoading) {
    return <p>Loading transactions...</p>
  }

  const transactions = result.data

  console.log(transactions)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold">Transactions</h1>
        </div>

        <div className="bg-background rounded-xl border p-6">
          <TransactionsTable columns={columns} data={transactions} />
        </div>
      </div>
    </div>
  )
}

export default App
