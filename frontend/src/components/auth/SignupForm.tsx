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
import { signupSchema } from '@/schemas/auth'
import { useSignup } from '@/hooks/useSignup'
import { toast } from 'sonner'
import { getErrorMessage } from '@/helpers'
import FormInputField from '../form/FormInputField'
import PasswordInputField from '../form/PasswordInputField'

function SignupForm() {
  const { mutate, isPending } = useSignup()
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validators: {
      onSubmit: signupSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(
        {
          first_name: value.firstName,
          last_name: value.lastName,
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
          <CardTitle className="text-3xl font-bold">
            Create your account
          </CardTitle>

          <CardDescription>
            Start tracking your finances in just a minute.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <form
          id="signup-form"
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field
                name="firstName"
                children={(field) => (
                  <FormInputField
                    field={field}
                    label="First name"
                    placeholder="John"
                  />
                )}
              />

              <form.Field
                name="lastName"
                children={(field) => (
                  <FormInputField
                    field={field}
                    label="Last name"
                    placeholder="Doe"
                  />
                )}
              />
            </div>

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

            <form.Field
              name="confirmPassword"
              children={(field) => (
                <PasswordInputField
                  field={field}
                  label="Confirm password"
                  placeholder="••••••••"
                />
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-5">
        <Button className="w-full" type="submit" form="signup-form">
          {isPending ? 'Creating account...' : 'Create account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary transition-colors hover:underline"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}

export default SignupForm
