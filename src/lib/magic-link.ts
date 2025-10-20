import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'

import { db } from '../db/index.ts'
import { magicLinkTokensTable } from '../db/schema.ts'

export async function createMagicLinkToken(email: string): Promise<string> {
  'use server'

  await db
    .delete(magicLinkTokensTable)
    .where(eq(magicLinkTokensTable.email, email))

  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)

  const id = encodeBase32(idBytes).toLowerCase()
  const token = encodeHexLowerCase(sha256(new TextEncoder().encode(id)))

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 1000 * 60 * 10)

  await db.insert(magicLinkTokensTable).values({
    id,
    createdAt: now,
    expiresAt,
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
