import { eq } from 'drizzle-orm'
import { z } from 'zod'

import { db } from '@/db/index.ts'
import { passwordResetTokensTable, usersTable } from '@/db/schema.ts'
import { createPasswordResetToken } from '@/lib/password-reset.ts'
import { sendEmail } from '@/utils/email/index.ts'
import ResetPasswordTemplate from '@/utils/email/templates/reset-password.tsx'
import { emailSchema } from '@/utils/validations/auth.ts'

const schema = z.object({
  email: emailSchema,
})

export const POST = async (request: Request) => {
  const body = await request.json()

  const validated = await schema.safeParseAsync({
    email: body.email,
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

  const userResult = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.email, validated.data.email))

  const user = userResult[0] ?? null

  if (user) {
    const tokenResult = await db
      .select()
      .from(passwordResetTokensTable)
      .where(eq(passwordResetTokensTable.email, user.email))

    const tokenData = tokenResult[0] ?? null

    if (tokenData)
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

    const token = await createPasswordResetToken(user.id, user.email)

    const url = `${process.env.NEXT_PUBLIC_URL}/reset-password/${token}`

    await sendEmail({
      from: `GeoWorld <${process.env.RESEND_EMAIL_FROM}>`,
      to: user.email,
      subject: 'Reset your password',
      text: `Please go to ${url} to reset your password`,
      html: ResetPasswordTemplate({
        resetPasswordLink: url,
      }),
    })
  }

  return Response.json({
    message: 'An email has been sent to you to reset your password.',
  })
}
