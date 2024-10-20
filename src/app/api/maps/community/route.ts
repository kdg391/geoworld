import { auth } from '@/auth.js'

import { MAPS_PAGE_LIMIT } from '@/constants/index.js'

import { createClient } from '@/utils/supabase/server.js'

import { mapParamsSchema } from '@/utils/validations/map.js'

import type { NextRequest } from 'next/server'
import type { Map } from '@/types/index.js'

export const revalidate = 60

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams

  const validated = await mapParamsSchema.safeParseAsync({
    page: searchParams.get('page'),
  })

  if (!validated.success)
    return Response.json(
      {
        message: 'Invalid Search Params',
        errors: validated.error.flatten().fieldErrors,
        code: 'invalid_search_params',
      },
      {
        status: 400,
      },
    )

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data: maps, error } = await supabase
    .rpc('get_community_maps', {
      p_offset: validated.data.page * MAPS_PAGE_LIMIT,
      p_limit: MAPS_PAGE_LIMIT,
    })
    .returns<Map[]>()

  return Response.json(
    {
      data: maps,
      error: error?.message ?? null,
    },
    {
      status: 200,
    },
  )
}
