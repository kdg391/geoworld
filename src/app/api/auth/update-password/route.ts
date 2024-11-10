import bcrypt from 'bcryptjs'
import { z } from 'zod'

import { createClient } from '@/utils/supabase/server.js'

import type { NextRequest } from 'next/server'
// import type { User } from '@/types/index.js'

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

  const { data, error: tokenErr } = await supabase
    .from('password_reset_tokens')
    .select('*')
    .eq('token', validated.data.token)
    .maybeSingle()

  if (!data || tokenErr)
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

  const hashedPassword = await bcrypt.hash(validated.data.password, 10)

  const { error } = await supabase
    .from('users')
    .update({
      hashed_password: hashedPassword,
    })
    .eq('email', data.email)

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
