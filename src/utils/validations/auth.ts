import { z } from 'zod'

// import { usernameSchema } from './profile.js'

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'The email has to be filled.')
  .email('This is not a valid email.')

export const passwordSchema = z
  .string()
  .min(8, 'The password must be at least 8 characters.')
  .max(60, 'The password must be at most 60 characters.')

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The password is not matched.',
        path: ['confirmPassword'],
      })
    }
  })

export const signInCredentialsSchema = z.object({
  email: emailSchema,
  password: z.string(),
})

export const signInEmailSchema = z.object({
  email: emailSchema,
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ password, confirmPassword }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The password is not matched.',
        path: ['confirmPassword'],
      })
    }
  })

export const changeEmailSchema = z
  .object({
    oldEmail: emailSchema,
    newEmail: emailSchema,
  })
  .superRefine(({ oldEmail, newEmail }, ctx) => {
    if (oldEmail === newEmail) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The email is the same as before.',
        path: ['newEmail'],
      })
    }
  })

export const changePasswordSchema = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The confirm password is not matched.',
        path: ['confirmPassword'],
      })
    }
  })

export const deleteAccountSchema = z.object({
  password: z.string(),
  confirmMessage: z.literal('DELETE'),
})
