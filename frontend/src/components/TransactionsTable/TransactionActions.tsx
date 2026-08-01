import type { Transaction } from '@/types/transactions.types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'
import { toast } from 'sonner'
import { TransactionDialog } from '../TransactionDialog'
import { useState } from 'react'
import { useDeleteTransaction } from '@/hooks/useDeleteTransaction'

function TransactionActions({ transaction }: { transaction: Transaction }) {
  const [open, setOpen] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const { mutate, isPending } = useDeleteTransaction()

  const handleDelete = () => {
    try {
      toast.warning('Are you sure you want to delete this transaction?', {
        action: {
          label: 'Delete',
          onClick: () =>
            mutate(transaction.id, {
              onSuccess: () => {
                toast.success('Transaction deleted successfully 🗑️')
              },
              onError: () => {
                toast.error('Failed to delete 🥲')
              },
            }),
        },
        cancel: {
          label: 'Cancel',
          onClick: () => console.log('Cancelled...'),
        },
      })
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault()
              setDialogOpen(true)
            }}
          >
            Edit
          </DropdownMenuItem>

          <TransactionDialog
            dialogOpen={dialogOpen}
            setDialogOpen={setDialogOpen}
            setDropdownOpen={setOpen}
            existing={transaction}
            mode="edit"
          />

          <DropdownMenuItem
            onSelect={() => {
              toast.success('Transaction id copied to clipboard')
              navigator.clipboard.writeText(transaction.id)
            }}
          >
            Copy transaction ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isPending}
            onSelect={() => handleDelete()}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default TransactionActions
