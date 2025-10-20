import { hash } from '@node-rs/argon2'
import { and, eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db/index.ts'
import {
  accountsTable,
  passwordResetTokensTable,
  usersTable,
} from '@/db/schema.ts'
import { passwordOptions } from '@/lib/password.ts'

import type { NextRequest } from 'next/server'

const schema = z.object({
  password: z.string(),
})

export const POST = async (
  request: NextRequest,
  segmentData: { params: Promise<{ token: string }> },
) => {
  const body = await request.json()

  const validated = await schema.safeParseAsync({
    password: body.password,
  })

  if (!validated.success)
    return Response.json(
      {
        message: 'Invalid body',
        errors: z.flattenError(validated.error).fieldErrors,
        code: 'invalid_body',
      },
      {
        status: 400,
      },
    )

  const params = await segmentData.params

  const result = await db
    .select()
    .from(passwordResetTokensTable)
    .where(eq(passwordResetTokensTable.token, params.token))

  const data = result[0] ?? null

  if (data === null)
    return Response.json(
      {
        errors: {
          message: 'Invalid token',
        },
      },
      {
        status: 400,
      },
    )

  if (Date.now() >= data.expiresAt.getTime())
    return Response.json(null, {
      status: 400,
    })

  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, data.email))

  const user = userResult[0] ?? null

  if (user === null)
    return Response.json(
      {
        errors: {
          message: 'Failed to update your password',
        },
      },
      {
        status: 500,
      },
    )

  const hashedPassword = await hash(validated.data.password, passwordOptions)

  await db
    .update(accountsTable)
    .set({
      hashedPassword: hashedPassword,
    })
    .where(
      and(
        eq(accountsTable.provider, 'credentials'),
        eq(accountsTable.userId, user.id),
      ),
    )

  return Response.json({
    message: 'Successfully updated the password',
  })
}
