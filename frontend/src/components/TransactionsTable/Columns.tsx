import type { Transaction } from '@/types/transactions.types'
import type { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './ColumnHeader'
import TransactionActions from './TransactionActions'
import { Badge } from '../ui/badge'

export const columns: ColumnDef<Transaction>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const formatted = new Date(row.getValue('date')).toDateString()
      return <div>{formatted}</div>
    },
  },
  {
    accessorKey: 'description',
    header: 'Description',
  },
  {
    accessorKey: 'category.name',
    header: 'Category',
    cell: ({ row }) => {
      const category = row.original.category

      if (!category) return null

      return <Badge variant="secondary">{category.name}</Badge>
    },
  },
  {
    accessorKey: 'transaction_type',
    header: 'Type',
    cell: ({ row }) => {
      const type = row.getValue('transaction_type') as string

      const isIncome = type === 'income'

      return (
        <Badge
          variant="outline"
          className={
            isIncome
              ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300'
              : 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300'
          }
        >
          {type.charAt(0).toUpperCase() + type.slice(1)}
        </Badge>
      )
    },
  },
  {
    accessorKey: 'amount',
    sortingFn: 'basic',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Amount"
        className="justify-center"
      />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'))
      const formatted = new Intl.NumberFormat('fi-FI', {
        style: 'currency',
        currency: 'EUR',
      }).format(amount)

      return <div className="text-center font-medium">{formatted}</div>
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const transaction = row.original
      return (
        <>
          <TransactionActions transaction={transaction} />
        </>
      )
    },
  },
]
