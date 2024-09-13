import z from 'zod'

import { MAX_ROUNDS } from '../../constants/index.js'

export const getGameSettingsSchema = (rounds: number) =>
  z.object({
    canMove: z.boolean(),
    canPan: z.boolean(),
    canZoom: z.boolean(),
    rounds: z
      .number()
      .min(1, 'The game rounds cannot be less than 1.')
      .max(MAX_ROUNDS, `The game rounds cannot be more than ${MAX_ROUNDS}.`)
      .max(rounds, `The game rounds cannot be more than ${rounds}.`),
    timeLimit: z
      .number()
      .min(0, 'The time limit cannot be less than 0 seconds.')
      .max(600, 'The time limit cannot be more than 10 minutes.')
      .nullable(),
  })
