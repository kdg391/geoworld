import { z } from 'zod'

import { auth } from '@/auth.js'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import { calculateMapBounds, calculateScoreFactor } from '@/utils/game.js'
import { getCountryFromCoordinates } from '@/utils/map.js'

import { createClient } from '@/utils/supabase/server.js'

import { mapDescriptionSchema, mapNameSchema } from '@/utils/validations/map.js'

import type { Location, Map } from '@/types/index.js'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  'use server'

  const session = await auth()

  const supabase = createClient({
    supabaseAccessToken: session?.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('maps')
    .select('*')
    .eq('id', params.id)
    .maybeSingle<Map>()

  if (error)
    return Response.json(
      {
        errors: {
          message: 'Database Error',
        },
        code: 'database_error',
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
        code: 'map_not_found',
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
        pano_id: z.string(),
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
  const session = await auth()

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
    .single<Map>()

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

  if (mapData.creator !== session.user.id)
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

  if (mapData.type === 'official' && session.user.role !== 'admin')
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
    isPublished: body.isPublished,
    locations: body.locations,
    name: body.name,
    description: body.description,
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

  const updateData: Partial<Map> = {}

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
      const { error: insertedErr } = await supabase.from('locations').insert(
        adding.map((loc) => ({
          map_id: mapData.id,
          user_id: session.user.id,
          streak_location_code: getCountryFromCoordinates({
            lat: loc.lat,
            lng: loc.lng,
          }),
          ...loc,
          heading: loc.heading ?? 0,
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

  const { error: updatedErr } = await supabase
    .from('maps')
    .update<Partial<Map>>(updateData)
    .eq('id', mapData.id)
    .single<Map>()

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
    message: 'Successfully updated the map',
  })
}

export const DELETE = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const session = await auth()

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
    .single<Map>()

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

  if (mapData.creator !== session.user.id)
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
    if (session.user.role !== 'admin')
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
