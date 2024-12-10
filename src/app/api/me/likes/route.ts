import { getCurrentSession } from '@/session.js'

import { createClient } from '@/utils/supabase/server.js'

export const GET = async () => {
  const { session, user } = await getCurrentSession()

  if (!session)
    return Response.json(
      {
        errors: {
          message: 'Unauthorized',
        },
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)

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

  return Response.json({
    data,
  })
}
