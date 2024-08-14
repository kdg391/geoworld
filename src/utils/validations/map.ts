import { z } from 'zod'

export const createMapValidation = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'The name cannot be less than 1 character.')
    .max(20, 'The name cannot be more than 20 characters.'),
  description: z
    .string()
    .trim()
    .max(60, 'The description cannot be less than 60 characters.')
    .nullable(),
})
