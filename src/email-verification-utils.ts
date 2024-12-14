import { ExpiringTokenBucket } from './rate-limit.js'

export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(
  3,
  60 * 10,
)
