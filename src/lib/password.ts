import type { Options } from '@node-rs/argon2'

export const passwordOptions: Options = {
  memoryCost: 19456,
  timeCost: 3,
  outputLen: 32,
  parallelism: 1,
}
