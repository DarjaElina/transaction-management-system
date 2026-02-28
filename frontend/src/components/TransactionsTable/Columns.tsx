import type { Transaction } from '@/types/transactions.types'
import type { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: 'date',
    header: 'Date',
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'transaction_type',
    header: 'Type',
  },
  {
    accessorKey: 'amount',
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
]
