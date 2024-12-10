import { hash } from '@node-rs/argon2'
import { z } from 'zod'

import { createClient } from '@/utils/supabase/server.js'

import type { NextRequest } from 'next/server'
import type { APIAccount } from '@/types/account.js'
import type { APIUser } from '@/types/user.js'

const schema = z.object({
  password: z.string(),
  token: z.string().uuid(),
})

export const PUT = async (request: NextRequest) => {
  const body = await request.json()

  const validated = await schema.safeParseAsync({
    password: body.password,
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

  const { data } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', validated.data.token)
    .maybeSingle()

  if (!data)
    return Response.json(
      {
        errors: {
          message: 'Cannot find the token',
        },
      },
      {
        status: 400,
      },
    )

  const hashedPassword = await hash(validated.data.password, {
    memoryCost: 19456,
    timeCost: 2,
    outputLen: 32,
    parallelism: 1,
  })

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', data.email)
    .single<APIUser>()

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

  const { error } = await supabase
    .from('accounts')
    .update<Partial<APIAccount>>({
      hashed_password: hashedPassword,
    })
    .eq('user_id', user.id)

  if (error)
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

  return Response.json({
    message: 'Successfully updated the password',
  })
}
