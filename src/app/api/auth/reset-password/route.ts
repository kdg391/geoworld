import { z } from 'zod'

import { sendEmail } from '@/utils/email.js'

import { createClient } from '@/utils/supabase/server.js'

import { emailSchema } from '@/utils/validations/auth.js'

import type { User } from '@/types/index.js'

const schema = z.object({
  emaIl: emailSchema,
})

export const POST = async (request: Request) => {
  const body = await request.json()

  const validated = await schema.safeParseAsync({
    email: body.email,
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

  const { data: user, error: userErr } = await supabase
    .from('users')
    .select('*')
    .eq('email', validated.data.emaIl)
    .single<User>()

  if (userErr)
    return Response.json(
      {
        message: 'Database Error',
        error: userErr.message,
        code: 'database_error',
      },
      {
        status: 500,
      },
    )

  if (user) {
    const { error } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('identifier', user.email)
      .maybeSingle()

    if (error)
      return Response.json(
        {
          error: 'Database Error',
        },
        {
          status: 500,
        },
      )

    const token = crypto.randomUUID()

    await supabase.from('password_reset_tokens').insert({
      expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      identifier: user.email,
      token,
    })

    const url = `${process.env.NEXT_PUBLIC_URL}/update-password?token=${token}`

    try {
      await sendEmail({
        html: `<h1>Reset your password</h1><a href="${url}">Click to reset</a>`,
        subject: 'Reset your password',
        text: `Please go to ${url} to reset your password`,
        to: user.email,
      })
    } catch (err) {
      if (err instanceof Error)
        return Response.json(
          {
            message: 'Something went wrong!',
          },
          {
            status: 500,
          },
        )
    }
  }

  return Response.json(
    {
      message: 'An email has been sent to you to reset your password.',
    },
    {
      status: 200,
    },
  )
}
