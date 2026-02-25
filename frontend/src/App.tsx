import { useQuery } from '@tanstack/react-query'
import { Button } from './components/ui/button'
import axios from 'axios'

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
    <>
      <p className="bg-amber-400">Hello app :-)</p>
      <Button>Click me</Button>
    </>
  )
}

export default App
