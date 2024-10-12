import { z } from 'zod'

export const displayNameSchema = z
  .string()
  .trim()
  .min(1, 'The display name has to be filled.')
  .max(20, 'The display name must be at least 20 characters.')

export const usernameSchema = z
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
  )

export const changeDisplayNameSchema = z
  .object({
    oldName: z.string(),
    newName: displayNameSchema,
  })
  .superRefine(({ oldName, newName }, ctx) => {
    if (oldName === newName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The display name is the same as before.',
        path: ['newName'],
      })
    }
  })

export const changeUsernameSchema = z
  .object({
    oldName: z.string(),
    newName: usernameSchema,
  })
  .superRefine(({ oldName, newName }, ctx) => {
    if (oldName === newName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'The username is the same as before.',
        path: ['newName'],
      })
    }
  })
