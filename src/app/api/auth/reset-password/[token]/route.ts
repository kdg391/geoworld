import { hash } from '@node-rs/argon2'
import { z } from 'zod'

import { passwordOptions } from '@/lib/password.js'

import { createClient } from '@/utils/supabase/server.js'

import type { NextRequest } from 'next/server'
import type { APIPasswordResetToken } from '@/lib/password-reset.js'
import type { APIAccount } from '@/types/account.js'
import type { APIUser } from '@/types/user.js'

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
        errors: validated.error.flatten().fieldErrors,
        code: 'invalid_body',
      },
      {
        status: 400,
      },
    )

  const params = await segmentData.params

  const supabase = createClient({
    serviceRole: true,
  })

  const { data } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', params.token)
    .maybeSingle<APIPasswordResetToken>()

  if (!data)
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

  if (Date.now() >= new Date(data.expires_at).getTime())
    return Response.json(null, {
      status: 400,
    })

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', data.email)
    .maybeSingle<APIUser>()

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

  const { error } = await supabase
    .from('accounts')
    .update<Partial<APIAccount>>({
      hashed_password: hashedPassword,
    })
    .match({
      provider: 'credentials',
      user_id: user.id,
    })

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

  return Response.json(
    {
      message: 'Successfully updated the password',
    },
    {
      headers: {
        'Referrer-Policy': 'strict-origin',
      },
    },
  )
}
