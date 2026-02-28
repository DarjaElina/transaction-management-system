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
    <div className="container mx-auto">
      <h1 className="text-center mb-1">Transactions</h1>
      <TransactionsTable columns={columns} data={transactions} />
    </div>
  )
}

export default App
