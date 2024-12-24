import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding'

import { createClient } from '../utils/supabase/server.js'

export async function createPasswordResetToken(
  userId: string,
  email: string,
): Promise<string> {
  'use server'

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('password_reset_tokens').delete().eq('user_id', userId)

  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)

  const id = encodeBase32(idBytes).toLowerCase()
  const token = encodeHexLowerCase(sha256(new TextEncoder().encode(id)))

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 60 * 10 * 1000)

  await supabase.from('password_reset_tokens').insert<APIPasswordResetToken>({
    id: crypto.randomUUID(),
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    email,
    token,
    user_id: userId,
  })

  return token
}

export interface APIPasswordResetToken {
  id: string
  created_at: string
  expires_at: string
  email: string
  token: string
  user_id: string
}

export interface PasswordResetToken {
  id: string
  createdAt: Date
  expiresAt: Date
  email: string
  token: string
  userId: string
}
