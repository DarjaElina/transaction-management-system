import { useState } from 'react'

import FormInputField from './FormInputField'
import PasswordToggleButton from './PasswordToggleButton'

type PasswordInputFieldProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  field: any
  label: string
  placeholder?: string
  autoComplete?: string
}

function PasswordInputField({
  field,
  label,
  placeholder,
  autoComplete,
}: PasswordInputFieldProps) {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <FormInputField
      field={field}
      label={label}
      placeholder={placeholder}
      autoComplete={autoComplete}
      type={showPassword ? 'text' : 'password'}
      rightIcon={
        <PasswordToggleButton
          visible={showPassword}
          onToggle={() => setShowPassword((v) => !v)}
        />
      }
    />
  )
}

export default PasswordInputField
