import z from 'zod'

export const emailValidation = z
  .string()
  .min(1, 'The email has to be filled.')
  .email('This is not a valid email.')

export const passwordValidation = z
  .string()
  .min(8, 'The password must be at least 8 characters.')
  .max(60, 'The password must be at most 60 characters.')

export const signUpValidation = z
  .object({
    email: emailValidation,
    password: passwordValidation,
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

export const signInValidation = z.object({
  email: emailValidation,
  password: z.string(),
})

export const resetPasswordValidation = z.object({
  email: emailValidation,
})

export const updatePasswordValidation = z
  .object({
    password: passwordValidation,
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
