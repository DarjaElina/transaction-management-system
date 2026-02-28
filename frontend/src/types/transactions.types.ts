export interface Transaction {
  date: Date
  description: string
  category: string
  type: 'income' | 'expence'
  amount: number
}
