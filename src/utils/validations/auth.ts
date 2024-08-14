import z from 'zod'

export const emailValidation = z
  .string()
  .trim()
  .min(1, 'The email has to be filled.')
  .email('This is not a valid email.')

export const passwordValidation = z
  .string()
  .min(8, 'The password must be at least 8 characters.')
  .max(60, 'The password must be at most 60 characters.')

export const signUpValidation = z.object({
  email: emailValidation,
  password: passwordValidation,
  username: z
    .string()
    .trim()
    .min(1, 'The username has to be filled.')
    .max(20, 'The username must be at least 20 characters.')
    .refine(
      (name) => /^[a-z]/.test(name),
      'The username must start with an alphabet.',
    )
    .refine(
      (name) => /^[a-z][a-z0-9_]*$/.test(name),
      'The username must contain letters, numbers, or underscores _.',
    ),
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

export const changeEmailValidation = z
  .object({
    oldEmail: z.string().trim().email(),
    newEmail: emailValidation,
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

export const changePasswordValidation = z
  .object({
    oldPassword: z.string(),
    newPassword: passwordValidation,
    confirmPassword: z.string(),
  })
  .superRefine(async ({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The confirm password is not matched.',
        path: ['confirmPassword'],
      })
    }
  })

export const deleteAccountValidation = z.object({
  password: z.string(),
})
