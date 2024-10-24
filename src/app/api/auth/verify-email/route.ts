import { z } from 'zod'

import { createClient } from '@/utils/supabase/server.js'

import { emailSchema } from '@/utils/validations/auth.js'

import type { NextRequest } from 'next/server'
import type { User } from '@/types/index.js'

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
    .from('verification_tokens')
    .select('*')
    .eq('token', validated.data.token)
    .single<{
      expires: string
      identifier: string
      token: string
    }>()

  if (!existingToken)
    return Response.json({
      error: 'The token does not exist',
    })

  const hasExpired = new Date(existingToken.expires).getTime() < Date.now()

  if (hasExpired)
    return Response.json({
      error: 'The token has expired',
    })

  const { data: existingUser } = await supabase
    .from('users')
    .select('*')
    .eq('email', existingToken.identifier)
    .single<User>()

  if (!existingUser)
    return Response.json({
      error: 'The email does not exist',
    })

  await supabase
    .from('users')
    .update({
      email: existingToken.identifier,
      emailVerified: new Date().toISOString(),
    })
    .eq('id', existingUser.id)

  await supabase
    .from('verification_tokens')
    .delete()
    .eq('token', existingToken.token)

  return Response.json({
    success: true,
  })
}
