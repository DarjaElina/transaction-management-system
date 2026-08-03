import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'

type PasswordToggleButtonProps = {
  visible: boolean
  onToggle: () => void
}

function PasswordToggleButton({
  visible,
  onToggle,
}: PasswordToggleButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onToggle}
      className="h-8 w-8 text-muted-foreground hover:bg-transparent hover:text-foreground"
    >
      {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}

      <span className="sr-only">
        {visible ? 'Hide password' : 'Show password'}
      </span>
    </Button>
  )
}

export default PasswordToggleButton
