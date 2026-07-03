import { useQuery } from '@tanstack/react-query'
import { getTransactons } from './api/transactions'
import { BrowserRouter, Route, Routes } from 'react-router'
import { mapTransactions } from './helpers'
import Transactions from './pages/Transactions'
import Dashboard from './pages/Dashboard'
import Layout from './pages/Layout'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'sonner'

function App() {
  const result = useQuery({
    queryKey: ['transactions'],
    queryFn: getTransactons,
  })

  const transactions = result.data ?? []
  const mappedTransactions = mapTransactions(transactions)

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route
              index
              element={
                <Transactions
                  transactions={mappedTransactions}
                  loading={result.isLoading}
                  error={result.error}
                />
              }
            />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </ThemeProvider>
  )
}

export default App
