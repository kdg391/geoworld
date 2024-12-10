import { z } from 'zod'

import { createClient } from '@/utils/supabase/server.js'

import { emailSchema } from '@/utils/validations/auth.js'

import type { NextRequest } from 'next/server'
import type { APIUser } from '@/types/user.js'

const schema = z.object({
  email: emailSchema,
  token: z.string().uuid(),
})

export const POST = async (request: NextRequest) => {
  const body = await request.json()

  const validated = await schema.safeParseAsync({
    email: body.email,
    token: body.token,
  })

  if (!validated.success)
    return Response.json(
      {
        message: 'Invalid Body',
        errors: validated.error.flatten().fieldErrors,
        code: 'invalid_body',
      },
      {
        status: 400,
      },
    )

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: existingToken } = await supabase
    .from('email_verification_tokens')
    .select('*')
    .eq('token', validated.data.token)
    .single<{
      id: string
      expires: string
      identifier: string
      token: string
    }>()

  if (!existingToken)
    return Response.json(
      {
        errors: {
          message: 'The token does not exist',
        },
      },
      {
        status: 500,
      },
    )

  const hasExpired = new Date(existingToken.expires).getTime() < Date.now()

  if (hasExpired)
    return Response.json(
      {
        errors: {
          message: 'The token has expired',
        },
      },
      {
        status: 500,
      },
    )

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', existingToken.identifier)
    .single<Pick<APIUser, 'id'>>()

  if (!existingUser)
    return Response.json(
      {
        errors: {
          message: 'Forbidden',
        },
      },
      {
        status: 500,
      },
    )

  await supabase
    .from('users')
    .update<Partial<APIUser>>({
      email: existingToken.identifier,
      email_verified: true,
      email_verified_at: new Date().toISOString(),
    })
    .eq('id', existingUser.id)

  await supabase
    .from('email_verification_tokens')
    .delete()
    .eq('token', existingToken.token)

  return Response.json({
    success: true,
  })
}
