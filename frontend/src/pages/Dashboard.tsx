import { FinancialSummary } from '@/components/dashboard/FinancialSummary/FinancialSummary'
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseOverview/IncomeExpenseChart'
import CategoryPieChart from '@/components/dashboard/SpendingByCategory/CategoryPieChart'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

        <p className="text-muted-foreground">Overview of your finances.</p>
      </div>

      <FinancialSummary />

      <IncomeExpenseChart />

      <div className="grid gap-6 xl:grid-cols-4">
        <CategoryPieChart />

        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Goals</CardTitle>
          </CardHeader>

          <CardContent>Coming soon...</CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
