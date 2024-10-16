import { auth } from '@/auth.js'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import type { Map } from '@/types/index.js'

export const revalidate = 60

export const GET = async (
  _: Request,
  { params }: { params: { id: string } },
) => {
  'use server'

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('id', params.id)
    .single<Map>()

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
        message: 'Map Not Found',
      },
      {
        status: 404,
      },
    )

  if (data.type === 'official') {
    const { t } = await createTranslation('common')

    data.name =
      data.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : data.id in OFFICIAL_MAP_COUNTRY_CODES
          ? t(`country.${OFFICIAL_MAP_COUNTRY_CODES[data.id]}`)
          : data.name
  }

  return Response.json({
    data,
  })
}

export const DELETE = async () => {}
