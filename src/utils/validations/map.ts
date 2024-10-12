import { z } from 'zod'

export const createMapSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'The name has to be filled.')
    .max(20, 'The name cannot be more than 20 characters.'),
  description: z
    .string()
    .trim()
    .max(60, 'The description cannot be less than 60 characters.')
    .nullable(),
})

export const mapParamsSchema = z.object({
  page: z
    .string()
    .transform((value) => (value === '' ? null : value))
    .nullable()
    .refine((value) => value === null || !isNaN(Number(value)), {
      message: 'Invalid number',
    })
    .transform((value) => (value === null ? null : Number(value)))
    .pipe(
      z
        .number({
          message: 'The page is required.',
        })
        .int('The page must be a integer.')
        .min(0, 'The page must be greater than or equal to 0.'),
    ),
})
