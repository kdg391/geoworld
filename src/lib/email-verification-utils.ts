import { ExpiringTokenBucket } from './rate-limit.ts'

export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(
  3,
  60 * 10,
)
