import { Wallet } from 'lucide-react'

function Brand({ description }: { description: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <Wallet className="h-5 w-5" />
      </div>

      <div>
        <h1 className="font-semibold">Budget Tracker</h1>

        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

export default Brand
