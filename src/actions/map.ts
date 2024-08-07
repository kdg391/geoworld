'use server'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '../constants/index.js'

import { createTranslation } from '../i18n/server.js'

import { calculateMapBounds, calculateScoreFactor } from '../utils/game.js'
import { getCountryFromCoordinates } from '../utils/map.js'

import { createClient } from '../utils/supabase/server.js'

import { createMapValidation } from '../utils/validations/map.js'

import type { Coords, Location, Map, Profile } from '../types/index.js'

export const getRandomCommunityMaps = async (limit: number) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_random_maps', {
      p_type: 'community',
      p_count: limit,
    })
    .select('*')
    .returns<Map[]>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const getRandomOfficialMaps = async (limit: number) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_random_maps', {
      p_type: 'official',
      p_count: limit,
    })
    .select('*')
    .returns<Map[]>()

  if (data) {
    const { t } = await createTranslation('translation')

    for (const map of data) {
      map.name =
        map.id === OFFICIAL_MAP_WORLD_ID
          ? t('world')
          : map.id in OFFICIAL_MAP_COUNTRY_CODES
            ? t(`country.${OFFICIAL_MAP_COUNTRY_CODES[map.id]}`)
            : map.name
    }
  }

  return {
    data,
    error: error?.message ?? null,
  }
}

const PAGE_PER_MAPS = 20

export const getCommunityMaps = async (page: number) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('type', 'community')
    .eq('is_published', true)
    .range(page * PAGE_PER_MAPS, (page + 1) * PAGE_PER_MAPS - 1)
    .returns<Map[]>()

  return {
    data,
    hasMore: data ? data.length >= PAGE_PER_MAPS : false,
    error: error?.message ?? null,
  }
}

export const getOfficialMaps = async (page: number) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('type', 'official')
    .eq('is_published', true)
    .range(page * PAGE_PER_MAPS, (page + 1) * PAGE_PER_MAPS - 1)
    .order('name', {
      ascending: true,
    })
    .returns<Map[]>()

  if (data) {
    const { t } = await createTranslation('translation')

    for (const map of data) {
      map.name =
        map.id === OFFICIAL_MAP_WORLD_ID
          ? t('world')
          : map.id in OFFICIAL_MAP_COUNTRY_CODES
            ? t(`country.${OFFICIAL_MAP_COUNTRY_CODES[map.id]}`)
            : map.name
    }
  }

  return {
    data,
    hasMore: data ? data.length >= PAGE_PER_MAPS : false,
    error: error?.message ?? null,
  }
}

export const getMap = async (id: string) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('id', id)
    .single<Map>()

  if (data?.type === 'official') {
    const { t } = await createTranslation('translation')

    data.name =
      data.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : data.id in OFFICIAL_MAP_COUNTRY_CODES
          ? t(`country.${OFFICIAL_MAP_COUNTRY_CODES[data.id]}`)
          : data.name
  }

  return {
    data,
    error: error?.message ?? null,
  }
}

export const createCommunityMap = async (data: {
  name: string
  description: string | null
  creator: string
}) => {
  'use server'

  const supabase = createClient()

  const validated = await createMapValidation.safeParseAsync(data)

  if (!validated.success)
    return {
      data: null,
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: mData, error: mErr } = await supabase
    .from('maps')
    .insert<Omit<Map, 'id' | 'created_at' | 'updated_at'>>({
      type: 'community',
      name: validated.data.name,
      description: validated.data.description,
      creator: validated.data.creator,
      is_published: false,

      //
      average_score: 0,
      locations_count: 0,
      score_factor: 0,
      bounds: null,
    })
    .select()
    .single<Map>()

  return {
    data: mData,
    errors: {
      message: mErr?.message ?? null,
    },
  }
}

export const updateMap = async (
  id: string,
  data: {
    name?: string
    is_published?: boolean
    locations?: Coords[]
  },
) => {
  'use server'

  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  if (!uData.user || uErr)
    return {
      data: null,
      error: uErr?.message ?? null,
    }

  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uData.user.id)
    .single<Profile>()

  if (!pData || pErr)
    return {
      data: null,
      error: pErr?.message ?? null,
    }

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', id)
    .single<Map>()

  if (!mapData || mErr)
    return {
      data: null,
      error: mErr?.message ?? null,
    }

  if (mapData.creator !== uData.user.id)
    return {
      data: null,
      error: mErr,
    }

  if (mapData.type === 'official' && !pData.is_admin)
    return {
      data: null,
      error: null,
    }

  if (data.locations && data.locations.length > 0) {
    const { data: oldLocs, error: lErr } = await supabase
      .from('locations')
      .select('*')
      .eq('map_id', mapData.id)
      .returns<Location[]>()

    if (!oldLocs || lErr)
      return {
        data: null,
        error: lErr?.message ?? null,
      }

    const newLocs = data.locations

    const adding = newLocs.filter((n) =>
      oldLocs.every((o) => o.pano_id !== n.pano_id),
    )
    const removing = oldLocs.filter((o) =>
      newLocs.every((n) => n.pano_id !== o.pano_id),
    )

    if (removing.length > 0) {
      for (const loc of removing) {
        const { error: err } = await supabase
          .from('locations')
          .delete()
          .eq('map_id', mapData.id)
          .eq('pano_id', loc.pano_id)

        if (err)
          return {
            data: null,
            error: err?.message ?? null,
          }
      }
    }

    if (adding.length > 0) {
      const { error: insertedErr } = await supabase.from('locations').insert(
        adding.map((loc) => ({
          map_id: mapData.id,
          user_id: uData.user.id,
          streak_location_code: getCountryFromCoordinates({
            lat: loc.lat,
            lng: loc.lng,
          }),
          ...loc,
        })),
      )

      if (insertedErr)
        return {
          data: null,
          error: insertedErr?.message ?? null,
        }
    }
  }

  const { data: updatedLocs, error: updatedLocsErr } = await supabase
    .from('locations')
    .select('*')
    .eq('map_id', mapData.id)
    .returns<Location[]>()

  if (!updatedLocs || updatedLocsErr)
    return {
      data: null,
      error: updatedLocsErr?.message ?? null,
    }

  const bounds =
    updatedLocs.length > 0
      ? calculateMapBounds(
          updatedLocs.map((loc) => ({
            lat: loc.lat,
            lng: loc.lng,
          })),
        )
      : { min: { lat: 0, lng: 0 }, max: { lat: 0, lng: 0 } }
  const scoreFactor = calculateScoreFactor(bounds)

  const { data: updatedData, error: updatedErr } = await supabase
    .from('maps')
    .update({
      name: data.name,
      locations_count: updatedLocs.length,
      bounds,
      score_factor: scoreFactor,
      updated_at: new Date().toISOString(),
    })
    .eq('id', mapData.id)
    .select()
    .single<Map>()

  return {
    data: updatedData,
    error: updatedErr?.message ?? null,
  }
}

export const deleteMap = async (id: string) => {
  'use server'

  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  if (!uData.user || uErr)
    return {
      data: null,
      error: uErr?.message ?? null,
    }

  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', uData.user.id)
    .single<Profile>()

  if (!pData || pErr)
    return {
      data: null,
      error: pErr?.message ?? null,
    }

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', id)
    .single<Map>()

  if (!mapData || mErr)
    return {
      data: null,
      error: mErr?.message ?? null,
    }

  if (mapData.creator !== uData.user.id)
    return {
      data: null,
      error: mErr,
    }

  if (mapData.type === 'official' && !pData.is_admin)
    return {
      data: null,
      error: null,
    }

  const { error: deletedErr } = await supabase
    .from('maps')
    .delete()
    .eq('id', mapData.id)

  if (deletedErr)
    return {
      data: null,
      error: deletedErr?.message ?? null,
    }

  return {
    data: true,
    error: null,
  }
}

export const getLocations = async (mapId: string) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .eq('map_id', mapId)
    .returns<Location[]>()

  return {
    data,
    error: error?.message ?? null,
  }
}
