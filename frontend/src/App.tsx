import { BrowserRouter, Route, Routes } from 'react-router'
import Transactions from './pages/Transactions'
import Dashboard from './pages/Dashboard'
import { ThemeProvider } from './components/ThemeProvider'
import { Toaster } from 'sonner'
import ProtectedLayout from './layouts/ProtectedLayout/ProtectedLayout'
import PublicLayout from './layouts/PublicLayout/PublicLayout'
import RootLayout from './layouts/RootLayout'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Landing from './pages/Landing/Landing'

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Route>

            <Route element={<ProtectedLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/transactions" element={<Transactions />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster richColors />
    </ThemeProvider>
  )
}

export default App
