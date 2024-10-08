'use server'

import { redirect } from 'next/navigation'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '../constants/index.js'

import { createTranslation } from '../i18n/server.js'

import { calculateMapBounds, calculateScoreFactor } from '../utils/game.js'
import { getCountryFromCoordinates } from '../utils/map.js'

import { createClient } from '../utils/supabase/server.js'

import { createMapSchema } from '../utils/validations/map.js'

import type { Coords, Location, Map, Profile } from '../types/index.js'

const PAGE_PER_MAPS = 20

export const getCommunityMaps = async (page: number) => {
  'use server'

  const supabase = createClient()

  const { data, error } = await supabase
    .rpc('get_community_maps', {
      p_offset: page * PAGE_PER_MAPS,
      p_limit: PAGE_PER_MAPS,
    })
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
    .rpc('get_official_maps', {
      p_offset: page * PAGE_PER_MAPS,
      p_limit: PAGE_PER_MAPS,
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

export const createCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      errors: {
        message: uErr?.message,
      },
    }

  const validated = await createMapSchema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: mData, error: mErr } = await supabase
    .from('maps')
    .insert<Partial<Map>>({
      type: 'community',
      name: validated.data.name,
      description:
        validated.data.description === '' ? null : validated.data.description,
      is_published: false,
      creator: user.id,
    })
    .select()
    .single<Map>()

  if (mErr)
    return {
      errors: {
        message: mErr?.message,
      },
    }

  redirect(`/map/${mData.id}/edit`)
}

export const editCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      errors: {
        message: uErr?.message,
      },
    }

  const validated = await createMapSchema.safeParseAsync({
    name: formData.get('name'),
    description: formData.get('description'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { error: mErr } = await supabase
    .from('maps')
    .update<Partial<Map>>({
      name: validated.data.name,
      description:
        validated.data.description === '' ? null : validated.data.description,
    })
    .eq('map_id', '')
    .select()
    .single<Map>()

  if (mErr)
    return {
      errors: {
        message: mErr?.message,
      },
    }

  return {
    errors: null,
  }
}

export const updateMap = async (
  id: string,
  data: {
    isPublished?: boolean
    locations?: Coords[]
  },
) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      error: uErr?.message ?? null,
    }

  const { data: pData, error: pErr } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single<Profile>()

  if (!pData || pErr)
    return {
      error: pErr?.message ?? null,
    }

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', id)
    .single<Map>()

  if (!mapData || mErr)
    return {
      error: mErr?.message ?? null,
    }

  if (mapData.creator !== user.id)
    return {
      error: mErr,
    }

  if (mapData.type === 'official' && !pData.is_admin)
    return {
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
        error: lErr?.message ?? null,
      }

    const newLocs = data.locations

    const adding = newLocs.filter((n) =>
      oldLocs.every((o) => o.pano_id !== n.pano_id),
    )
    const updating = newLocs.filter((n) =>
      oldLocs.some(
        (o) =>
          o.pano_id === n.pano_id &&
          (o.heading !== n.heading || o.pitch !== n.pitch || o.zoom !== n.zoom),
      ),
    )
    const removing = oldLocs.filter((o) =>
      newLocs.every((n) => n.pano_id !== o.pano_id),
    )

    if (removing.length > 0) {
      const { error: removedErr } = await supabase
        .from('locations')
        .delete()
        .eq('map_id', mapData.id)
        .in(
          'pano_id',
          removing.map((loc) => loc.pano_id),
        )

      if (removedErr)
        return {
          error: removedErr?.message ?? null,
        }
    }

    if (adding.length > 0) {
      const { error: insertedErr } = await supabase.from('locations').insert(
        adding.map((loc) => ({
          map_id: mapData.id,
          user_id: user.id,
          streak_location_code: getCountryFromCoordinates({
            lat: loc.lat,
            lng: loc.lng,
          }),
          ...loc,
        })),
      )

      if (insertedErr)
        return {
          error: insertedErr?.message ?? null,
        }
    }

    if (updating.length > 0) {
      const { error } = await supabase
        .from('locations')
        .upsert(updating)
        .eq('map_id', mapData.id)

      if (error)
        return {
          error: error.message ?? null,
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

  const updateData: Partial<Map> = {
    bounds,
    locations_count: updatedLocs.length,
    score_factor: scoreFactor,
    updated_at: new Date().toISOString(),
  }

  const { error: updatedErr } = await supabase
    .from('maps')
    .update<Partial<Map>>(updateData)
    .eq('id', mapData.id)
    .single<Map>()

  return {
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

export const hasLiked = async (mapId: string) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      data: false,
      error: uErr?.message ?? null,
    }

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('map_id', mapId)
    .maybeSingle()

  return {
    data: data !== null,
    error: error?.message ?? null,
  }
}

export const getLikes = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      data: null,
      error: uErr?.message ?? null,
    }

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)

  return {
    data,
    error: error?.message ?? null,
  }
}

export const addLike = async (mapId: string) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      data: false,
      error: uErr?.message ?? null,
    }

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('map_id', mapId)
    .maybeSingle()

  if (data !== null)
    return {
      data: false,
      error: 'The map is already liked.',
    }

  const { error } = await supabase.from('likes').insert({
    map_id: mapId,
    user_id: user.id,
  })

  if (error)
    return {
      data: false,
      error: error.message,
    }

  return {
    data: true,
    error: null,
  }
}

export const deleteLike = async (mapId: string) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr)
    return {
      data: false,
      error: uErr?.message ?? null,
    }

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('map_id', mapId)
    .maybeSingle()

  if (data === null)
    return {
      data: false,
      error: 'The map is not liked.',
    }

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('map_id', mapId)

  if (error)
    return {
      data: false,
      error: error.message,
    }

  return {
    data: true,
    error: null,
  }
}
