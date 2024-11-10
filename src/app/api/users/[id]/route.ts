import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

import type { Profile } from '@/types/index.js'

export const revalidate = 300

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<Profile>()

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
