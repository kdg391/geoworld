import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding'

import { createClient } from './utils/supabase/server.js'

export async function createMagicLinkToken(email: string): Promise<string> {
  'use server'

  const supabase = createClient({
    serviceRole: true,
  })

  await supabase.from('magic_link_tokens').delete().eq('email', email)

  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)

  const id = encodeBase32(idBytes).toLowerCase()
  const token = encodeHexLowerCase(sha256(new TextEncoder().encode(id)))

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 10)

  await supabase.from('magic_link_tokens').insert<APIMagicLinkToken>({
    id,
    created_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
    email,
    token,
  })

  return token
}

export interface APIMagicLinkToken {
  id: string
  created_at: string
  expires_at: string
  email: string
  token: string
}

export interface MagicLinkToken {
  id: string
  createdAt: Date
  expiresAt: Date
  email: string
  token: string
}
