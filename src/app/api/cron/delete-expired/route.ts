import { createClient } from '@/utils/supabase/server.js'

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  )
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    serviceRole: true,
  })

  const date1 = new Date()
  date1.setDate(date1.getDate() - 30)

  const { error: gErr } = await supabase
    .from('games')
    .delete()
    .eq('state', 'started')
    .lt('created_at', date1.toISOString())

  if (gErr)
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    )

  const date2 = new Date()

  const { error: pErr } = await supabase
    .from('password_reset_tokens')
    .delete()
    .lte('expires', date2.toISOString())

  if (pErr)
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    )

  const date3 = new Date()

  const { error: vErr } = await supabase
    .from('email_verification_codes')
    .delete()
    .lte('expires', date3.toISOString())

  if (vErr)
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    )

  const date4 = new Date()

  const { error: mErr } = await supabase
    .from('magic_link_tokens')
    .delete()
    .lte('expires', date4.toISOString())

  if (mErr)
    return Response.json(
      {
        message: 'Something went wrong',
      },
      {
        status: 500,
      },
    )

  return Response.json({
    success: true,
  })
}
