import { ExpiringTokenBucket } from './rate-limit'

export const sendVerificationEmailBucket = new ExpiringTokenBucket<string>(
  3,
  60 * 10,
)
