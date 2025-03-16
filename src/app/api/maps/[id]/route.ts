import { z } from 'zod'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import { calculateMapBounds, calculateScoreFactor } from '@/utils/game.js'
import { getCountryFromCoordinates } from '@/utils/map.js'

import { createClient } from '@/utils/supabase/server.js'

import { mapDescriptionSchema, mapNameSchema } from '@/utils/validations/map.js'

import type { APILocation, Location } from '@/types/location.js'
import type { APIMap } from '@/types/map.js'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  'use server'

  const { session } = await getCurrentSession()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<APIMap>()

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

  if (!data)
    return Response.json(
      {
        errors: {
          message: 'Map Not Found',
        },
      },
      {
        status: 404,
      },
    )

  if (data.type === 'official') {
    const { t } = await createTranslation(['common', 'country'])

    data.name =
      data.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : data.id in OFFICIAL_MAP_COUNTRY_CODES
          ? t(`country:${OFFICIAL_MAP_COUNTRY_CODES[data.id]}`)
          : data.name
  }

  return Response.json({
    data,
  })
}

const schema = z.object({
  isPublished: z.boolean().optional(),
  locations: z
    .array(
      z.object({
        lat: z.number(),
        lng: z.number(),
        heading: z.number(),
        panoId: z.string(),
        pitch: z.number(),
        zoom: z.number(),
      }),
    )
    .optional(),
  name: mapNameSchema.optional(),
  description: mapDescriptionSchema.optional(),
})

export const PATCH = async (
  request: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const { session, user } = await getCurrentSession()

  if (!session)
    return Response.json(
      {
        errors: {
          message: 'Unauthorized',
        },
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data: mapData, error: mapErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<APIMap>()

  if (mapErr)
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

  if (!mapData)
    return Response.json(
      {
        errors: {
          message: 'Map Not Found',
        },
      },
      {
        status: 404,
      },
    )

  if (mapData.creator !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This map is not your map.',
        },
      },
      {
        status: 401,
      },
    )

  if (mapData.type === 'official' && user.role !== 'admin')
    return Response.json(
      {
        errors: {
          message: 'You cannot edit the official map.',
        },
      },
      {
        status: 401,
      },
    )

  const body = await request.json()

  const validated = await schema.safeParseAsync({
    name: body.name,
    description: body.description,
    isPublished: body.isPublished,
    locations: body.locations,
  })

  if (!validated.success)
    return Response.json(
      {
        errors: validated.error.flatten().fieldErrors,
      },
      {
        status: 400,
      },
    )

  const updateData: Partial<APIMap> = {}

  if (validated.data.locations && validated.data.locations.length > 0) {
    const { data: oldLocs, error: lErr } = await supabase
      .from('locations')
      .select('*')
      .eq('map_id', mapData.id)
      .returns<Location[]>()

    if (lErr)
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

    if (!oldLocs)
      return Response.json(
        {
          errors: {
            message: 'Something went wrong!',
          },
        },
        {
          status: 500,
        },
      )

    const newLocs = validated.data.locations

    const adding = newLocs.filter((n) =>
      oldLocs.every((o) => o.panoId !== n.panoId),
    )
    const updating = newLocs.filter((n) =>
      oldLocs.some(
        (o) =>
          o.panoId === n.panoId &&
          (o.heading !== n.heading || o.pitch !== n.pitch || o.zoom !== n.zoom),
      ),
    )
    const removing = oldLocs.filter((o) =>
      newLocs.every((n) => n.panoId !== o.panoId),
    )

    if (removing.length > 0) {
      const { error: removedErr } = await supabase
        .from('locations')
        .delete()
        .eq('map_id', mapData.id)
        .in(
          'pano_id',
          removing.map((loc) => loc.panoId),
        )

      if (removedErr)
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
    }

    if (adding.length > 0) {
      const { error: insertedErr } = await supabase
        .from('locations')
        .insert<Partial<APILocation>[]>(
          adding.map((loc) => ({
            map_id: mapData.id,
            user_id: user.id,
            streak_location_code: getCountryFromCoordinates({
              lat: loc.lat,
              lng: loc.lng,
            }),
            lat: loc.lat,
            lng: loc.lng,
            heading: loc.heading ?? 0,
            pano_id: loc.panoId,
            pitch: loc.pitch,
            zoom: loc.zoom,
          })),
        )

      if (insertedErr)
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
    }

    if (updating.length > 0) {
      const { error } = await supabase
        .from('locations')
        .upsert(updating)
        .eq('map_id', mapData.id)

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
    }

    const { data: updatedLocs, error: updatedLocsErr } = await supabase
      .from('locations')
      .select('*')
      .eq('map_id', mapData.id)
      .returns<Location[]>()

    if (updatedLocsErr)
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

    if (!updatedLocs)
      return Response.json(
        {
          errors: {
            message: 'Something went wrong!',
          },
        },
        {
          status: 404,
        },
      )

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

    updateData.bounds = bounds
    updateData.locations_count = updatedLocs.length
    updateData.score_factor = scoreFactor
  }

  if (validated.data.isPublished !== undefined)
    updateData.is_published = validated.data.isPublished

  if (validated.data.name) updateData.name = validated.data.name

  if (typeof validated.data.description === 'string')
    updateData.description =
      validated.data.description === '' ? null : validated.data.description

  updateData.updated_at = new Date().toISOString()

  const { data: updatedData, error: updatedErr } = await supabase
    .from('maps')
    .update<Partial<APIMap>>(updateData)
    .eq('id', mapData.id)
    .select()
    .single<APIMap>()

  if (updatedErr)
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
    data: updatedData,
    message: 'Successfully updated the map',
  })
}

export const DELETE = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const { session, user } = await getCurrentSession()

  if (!session)
    return Response.json(
      {
        errors: {
          message: 'Unauthorized',
        },
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data: mapData, error: mapErr } = await supabase
    .from('maps')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<APIMap>()

  if (mapErr)
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

  if (!mapData)
    return Response.json(
      {
        errors: {
          message: 'Something went wrong!',
        },
      },
      {
        status: 404,
      },
    )

  if (mapData.creator !== user.id)
    return Response.json(
      {
        errors: {
          message: 'This map is not your map.',
        },
      },
      {
        status: 401,
      },
    )

  if (mapData.type === 'official') {
    if (user.role !== 'admin')
      return Response.json(
        {
          errors: {
            message: 'You cannot delete the official map.',
          },
        },
        {
          status: 401,
        },
      )

    return Response.json(
      {
        errors: {
          message: 'The official map cannot be deleted.',
        },
      },
      {
        status: 500,
      },
    )
  }

  const { error: deletedErr } = await supabase
    .from('maps')
    .delete()
    .eq('id', mapData.id)

  if (deletedErr)
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
    data: true,
  })
}
