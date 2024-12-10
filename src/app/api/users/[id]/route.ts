import { getCurrentSession } from '@/session.js'

import { createClient } from '@/utils/supabase/server.js'

import type { APIProfile } from '@/types/profile.js'

export const revalidate = 300

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<APIProfile>()

  if (error)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
        code: 'database_error',
      },
      {
        status: 500,
      },
    )

  if (!data)
    return Response.json(
      {
        errors: {
          message: 'User Not Found',
        },
        code: 'user_not_found',
      },
      {
        status: 404,
      },
    )

  return Response.json({
    data,
  })
}
