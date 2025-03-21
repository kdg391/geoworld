import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.js'
import { MAPS_PAGE_LIMIT } from '@/constants/map.js'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import { createClient } from '@/utils/supabase/server.js'

import { mapParamsSchema } from '@/utils/validations/map.js'

import type { NextRequest } from 'next/server'
// import type { APIMap } from '@/types/map.js'

// export const revalidate = 60

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

  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .rpc('get_official_maps', {
      p_offset: validated.data.page * MAPS_PAGE_LIMIT,
      p_limit: MAPS_PAGE_LIMIT,
    })

  if (data) {
    const { t } = await createTranslation(['common', 'country'])

    for (const map of data) {
      map.name =
        map.id === OFFICIAL_MAP_WORLD_ID
          ? t('world')
          : map.id in OFFICIAL_MAP_COUNTRY_CODES
            ? t(`country:${OFFICIAL_MAP_COUNTRY_CODES[map.id]}`)
            : map.name
    }
  }

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
