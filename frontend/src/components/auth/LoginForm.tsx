import { Link, useNavigate } from 'react-router'
import { useForm } from '@tanstack/react-form'
import { Wallet } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'

import { loginSchema } from '@/schemas/auth'
import { login } from '@/api/auth'
import { toast } from 'sonner'

function LoginForm() {
  const queryClient = useQueryClient()

  const navigate = useNavigate()

  const { isPending, mutate } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      console.log(data)
    },
  })

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
          onError: (e) => {
            toast.error(e?.message ?? 'Something went wrong 🥲')
          },
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ['current-user'],
            })
            navigate('/transactions')
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
              children={(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Email</FieldLabel>

                    <Input
                      id={field.name}
                      type="email"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="john@example.com"
                      autoComplete="email"
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
            />

            <form.Field
              name="password"
              children={(field) => {
                const invalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <Field data-invalid={invalid}>
                    <FieldLabel htmlFor={field.name}>Password</FieldLabel>

                    <Input
                      id={field.name}
                      type="password"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />

                    {invalid && <FieldError errors={field.state.meta.errors} />}
                  </Field>
                )
              }}
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
