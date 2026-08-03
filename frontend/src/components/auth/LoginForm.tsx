import { Link, useNavigate } from 'react-router'
import { useForm } from '@tanstack/react-form'
import { Wallet } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { FieldGroup } from '@/components/ui/field'

import { loginSchema } from '@/schemas/auth'
import { useLogin } from '@/hooks/useLogin'
import { getErrorMessage } from '@/helpers'
import { toast } from 'sonner'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'

function LoginForm() {
  const { mutate, isPending } = useLogin()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },

    validators: {
      onSubmit: loginSchema,
    },

    onSubmit: async ({ value }) => {
      mutate(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate('/transactions')
          },

          onError: (error) => {
            toast.error(getErrorMessage(error))
          },
        },
      )
    },
  })

  return (
    <Card className="mx-auto w-full max-w-md border-border/60 shadow-sm">
      <CardHeader className="space-y-4 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Wallet className="h-6 w-6" />
        </div>

        <div className="space-y-2">
          <CardTitle className="text-3xl font-bold">Welcome back</CardTitle>

          <CardDescription>Sign in to manage your finances.</CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          id="login-form"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <form.Field
              name="email"
              children={(field) => (
                <FormInputField
                  field={field}
                  label="Email"
                  placeholder="john@example.com"
                  type="email"
                  autoComplete="email"
                />
              )}
            />

            <form.Field
              name="password"
              children={(field) => (
                <PasswordInputField
                  field={field}
                  label="Password"
                  placeholder="••••••••"
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-5">
        <Button className="w-full" type="submit" form="login-form">
          {isPending ? 'Signing in...' : 'Sign in'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-medium text-primary transition-colors hover:underline"
          >
            Create account
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default LoginForm
