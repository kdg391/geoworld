import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32, encodeHexLowerCase } from '@oslojs/encoding'
import { eq } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import { passwordResetTokensTable } from '@/db/schema.ts'

export async function createPasswordResetToken(
  userId: string,
  email: string,
): Promise<string> {
  'use server'

  await db
    .delete(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.id, userId))

  const idBytes = new Uint8Array(20)
  crypto.getRandomValues(idBytes)

  const id = encodeBase32(idBytes).toLowerCase()
  const token = encodeHexLowerCase(sha256(new TextEncoder().encode(id)))

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 60 * 10 * 1000)

  await db.insert(passwordResetTokensTable).values({
    id: crypto.randomUUID(),
    createdAt: now,
    expiresAt,
    email,
    token,
    userId,
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
