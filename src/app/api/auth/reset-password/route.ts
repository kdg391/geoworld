import { z } from 'zod'

import { resend } from '@/utils/email/index.js'
import ResetPasswordTemplate from '@/utils/email/templates/reset-password.js'
import { createClient } from '@/utils/supabase/server.js'
import { emailSchema } from '@/utils/validations/auth.js'

import type { APIUser } from '@/types/user.js'

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
    .single<APIUser>()

  if (userErr)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
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
          errors: {
            message: 'Database Error',
          },
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
      await resend.emails.send({
        from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
        to: user.email,
        subject: 'Reset your password',
        text: `Please go to ${url} to reset your password`,
        react: ResetPasswordTemplate({
          resetPasswordLink: url,
        }),
      })
    } catch (err) {
      if (err instanceof Error)
        return Response.json(
          {
            errors: {
              message: 'Something went wrong!',
            },
          },
          {
            status: 500,
          },
        )
    }
  }

  return Response.json({
    message: 'An email has been sent to you to reset your password.',
  })
}
