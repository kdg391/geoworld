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

  const date = new Date()

  const { error } = await supabase
    .from('password_reset_tokens')
    .delete()
    .lte('expires', date.toISOString())

  if (error)
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
