'use server'

import { calculateMapBounds, calculateScoreFactor } from '../utils/game.js'

import { createClient } from '../utils/supabase/server.js'

import type { Location, Map, Profile } from '../types/index.js'
import { createMapValidation } from '../utils/validations/map.js'

export const getCommunityMaps = async () => {
  'use server'
  const supabase = createClient()

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('type', 'community')
    .returns<Map[]>()

  return {
    data,
    error: error?.message ?? null,
  }
}

export const getOfficialMaps = async () => {
  'use server'
  const supabase = createClient()

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('type', 'official')
    .returns<Map[]>()

  return {
    data,
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

  return {
    data,
    error: error?.message ?? null,
  }
}

export const createOfficialMap = async () => {
  'use server'
  const supabase = createClient()

  await supabase.from('maps').insert({
    type: 'official',
  })
}

export const createCommunityMap = async (data: {
  name: string
  description: string | null
  creator: string
  public: boolean
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
    .insert<Omit<Map, 'id' | 'created_at'>>({
      type: 'community',
      name: validated.data.name,
      description: validated.data.description,
      creator: validated.data.creator,
      public: validated.data.public,

      //
      locations_count: 0,
      score_factor: 0,
      bounds: { min: { lat: 0, lng: 0 }, max: { lat: 0, lng: 0 } },
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
    locations?: Omit<Location, 'id' | 'map_id' | 'user_id'>[]
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

    console.log('oldLocs', oldLocs)
    console.log('newLocs', newLocs)

    console.log('adding', adding)
    console.log('removing', removing)

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

    for (const loc of adding) {
      const { error: err } = await supabase.from('locations').insert({
        map_id: mapData.id,
        user_id: uData.user.id,
        ...loc,
      })

      if (err)
        return {
          data: null,
          error: err?.message ?? null,
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

  console.log('map has updated', updatedData, updatedErr)

  return {
    data: updatedData,
    error: updatedErr?.message ?? null,
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
