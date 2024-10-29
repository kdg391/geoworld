'use server'

import { redirect } from 'next/navigation'

import { auth } from '../auth.js'

import { calculateMapBounds, calculateScoreFactor } from '../utils/game.js'
import { getCountryFromCoordinates } from '../utils/map.js'
import { createClient } from '../utils/supabase/server.js'
import { createMapSchema } from '../utils/validations/map.js'

import type { Coords, Location, Map } from '../types/index.js'

export const getMap = async (id: string) => {
  const { data, error } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/${id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

  return {
    data,
    error: error?.message ?? null,
  }
}

export const createCommunityMap = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

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
      creator: session.user.id,
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

  const session = await auth()

  if (!session)
    return {
      errors: {
        message: 'Unauthorized',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

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

  const session = await auth()

  if (!session)
    return {
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: mapData, error: mErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', id)
    .single<Map>()

  if (!mapData || mErr)
    return {
      error: mErr?.message ?? null,
    }

  if (mapData.creator !== session.user.id)
    return {
      error: mErr,
    }

  if (mapData.type === 'official' && session.user.role !== 'admin')
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
          user_id: session.user.id,
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

  const session = await auth()

  if (!session)
    return {
      data: null,
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

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

  if (mapData.creator !== session.user.id)
    return {
      data: null,
      error: mErr,
    }

  if (mapData.type === 'official' && session.user.role !== 'admin')
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

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

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

export const getLikes = async () => {
  'use server'

  const session = await auth()

  if (!session)
    return {
      data: null,
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', session.user.id)

  return {
    data,
    error: error?.message ?? null,
  }
}

export const addLike = async (mapId: string) => {
  'use server'

  const session = await auth()

  if (!session)
    return {
      data: null,
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', session.user.id)
    .eq('map_id', mapId)
    .maybeSingle()

  if (data !== null)
    return {
      data: false,
      error: 'The map is already liked.',
    }

  const { error } = await supabase.from('likes').insert({
    map_id: mapId,
    user_id: session.user.id,
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

  const session = await auth()

  if (!session)
    return {
      data: null,
      error: 'Unauthorized',
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', session.user.id)
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
    .eq('user_id', session.user.id)
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
