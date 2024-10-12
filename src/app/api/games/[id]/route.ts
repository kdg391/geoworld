import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

import type { Game } from '@/types/index.js'

export const GET = async (
  _: Request,
  { params }: { params: { id: string } },
) => {
  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single<Game>()

  if (error)
    return Response.json(
      {
        error: 'Database Error',
      },
      {
        status: 500,
      },
    )

  if (!data)
    return Response.json(
      {
        data: null,
        error: 'Game Not Found',
      },
      {
        status: 404,
      },
    )

  return Response.json({
    data,
  })
}
