import { Field, FieldError, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'

type FormInputFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  label: string
  placeholder?: string
  type?: string
  autoComplete?: string
  autoFocus?: boolean
  min?: number
  step?: number
  rightIcon?: React.ReactNode
}

function FormInputField({
  field,
  label,
  placeholder,
  type = 'text',
  autoComplete,
  autoFocus,
  min,
  step,
  rightIcon,
}: FormInputFieldProps) {
  const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={field.name}>{label}</FieldLabel>

      <div className="relative">
        <Input
          id={field.name}
          name={field.name}
          value={field.state.value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          aria-invalid={isInvalid}
          placeholder={placeholder}
          autoComplete={autoComplete}
          autoFocus={autoFocus}
          type={type}
          min={min}
          step={step}
          className={rightIcon ? 'pr-10' : undefined}
        />

        {rightIcon && (
          <div className="absolute inset-y-0 right-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>

      {isInvalid && <FieldError errors={field.state.meta.errors} />}
    </Field>
  )
}

export default FormInputField
