export interface Transaction {
  id: string
  date: Date
  description: string
  category: string
  type: 'income' | 'expence'
  amount: number
}
