import * as z from 'zod'

export const signupSchema = z
  .object({
    firstName: z
      .string()
      .trim()
      .min(2, 'First name must contain at least 2 characters')
      .max(50, 'First name is too long'),

    lastName: z
      .string()
      .trim()
      .min(2, 'Last name must contain at least 2 characters')
      .max(50, 'Last name is too long'),

    email: z.email('Please enter a valid email address'),

    password: z
      .string()
      .min(8, 'Password must contain at least 8 characters')
      .max(100, 'Password is too long'),

    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),

  password: z.string().min(1, 'Password is required'),
})
