import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

import type { Profile } from '@/types/index.js'

export const revalidate = 300

export const GET = async (
  _: Request,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<Profile>()

  if (error)
    return Response.json(
      {
        message: 'Database Error',
        error: error.message,
        code: 'database_error',
      },
      {
        status: 500,
      },
    )

  if (!data)
    return Response.json(
      {
        message: 'User Not Found',
        code: 'user_not_found',
      },
      {
        status: 404,
      },
    )

  return Response.json(
    {
      data,
    },
    {
      status: 200,
    },
  )
}
