import { z } from 'zod'

export const displayNameSchema = z
  .object({
    oldName: z.string(),
    newName: z
      .string()
      .trim()
      .min(1, 'The display name has to be filled.')
      .max(20, 'The display name must be at least 20 characters.'),
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

export const usernameSchema = z
  .object({
    oldName: z.string(),
    newName: z
      .string()
      .trim()
      .min(1, 'The username has to be filled.')
      .max(20, 'The username must be at least 20 characters.'),
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
