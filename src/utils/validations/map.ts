import { z } from 'zod'

export const createMapValidation = z.object({
  name: z.string().trim().min(1, 'The name min 1').max(20, 'The name max 20'),
  description: z.string().max(60, 'The description max 60').nullable(),
  creator: z.string(),
  public: z.boolean(),
})
