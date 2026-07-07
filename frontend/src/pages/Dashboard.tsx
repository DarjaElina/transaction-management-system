import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseOverview/IncomeExpenseChart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your finances.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Net Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Coming soon...</p>
          </CardContent>
        </Card>

        <IncomeExpenseChart />

        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Pie chart placeholder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Line chart placeholder</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Largest Expense</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Biggest transaction this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Recent transactions</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
