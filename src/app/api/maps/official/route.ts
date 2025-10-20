import { and, asc, eq, sql } from 'drizzle-orm'
import { z } from 'zod'

import {
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
} from '@/constants/index.ts'
import { MAPS_PAGE_LIMIT } from '@/constants/map.ts'
import { db } from '@/db/index.ts'
import { mapsTable } from '@/db/schema.ts'
import { createTranslation } from '@/i18n/server.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'
import { mapParamsSchema } from '@/utils/validations/map.ts'

import type { NextRequest } from 'next/server'
import type { APIMap } from '@/types/map.ts'

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
        errors: z.flattenError(validated.error).fieldErrors,
        code: 'invalid_search_params',
      },
      {
        status: 400,
      },
    )

  const data = await getOfficialMaps({
    offset: validated.data.page * MAPS_PAGE_LIMIT,
    limit: MAPS_PAGE_LIMIT,
  })

  const { t } = await createTranslation(['common', 'country'])

  for (const map of data) {
    map.name =
      map.id === OFFICIAL_MAP_WORLD_ID
        ? t('world')
        : map.id in OFFICIAL_MAP_COUNTRY_CODES
          ? t(`country:${OFFICIAL_MAP_COUNTRY_CODES[map.id]}`)
          : map.name
  }

  return Response.json({
    data: camelCaseToSnakeCase<APIMap[]>(
      data.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
        updatedAt: d.updatedAt.toISOString(),
      })),
    ),
  })
}

/*
CREATE OR REPLACE FUNCTION geoworld.get_official_maps(p_offset int, p_limit int)
RETURNS TABLE (
  created_at timestamptz,
  name text,
  description text,
  creator uuid,
  type geoworld.map_type,
  id uuid,
  bounds jsonb,
  updated_at timestamptz,
  average_score int4,
  score_factor float8,
  locations_count int4,
  is_published boolean,
  explorers_count int4,
  likes_count int4
)
SECURITY DEFINER set search_path = ''
as $$
BEGIN
  RETURN QUERY
  SELECT m.created_at, m.name, m.description, m.creator, m.type, m.id, m.bounds, m.updated_at, m.average_score, m.score_factor, m.locations_count, m.is_published, m.explorers_count, m.likes_count
  FROM geoworld.maps m
  WHERE (m.type = 'official' and m.is_published = true)
  ORDER BY CASE WHEN m.id = '8c050dd2-d8da-41a9-a83a-d386d051afd3' then 0 else 1 end, name asc
  OFFSET p_offset
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;
*/
const getOfficialMaps = async ({
  offset,
  limit,
}: {
  offset: number
  limit: number
}) => {
  const maps = await db
    .select({
      createdAt: mapsTable.createdAt,
      name: mapsTable.name,
      description: mapsTable.description,
      creator: mapsTable.creator,
      type: mapsTable.type,
      id: mapsTable.id,
      bounds: mapsTable.bounds,
      updatedAt: mapsTable.updatedAt,
      averageScore: mapsTable.averageScore,
      scoreFactor: mapsTable.scoreFactor,
      locationsCount: mapsTable.locationsCount,
      isPublished: mapsTable.isPublished,
      explorersCount: mapsTable.explorersCount,
      likesCount: mapsTable.likesCount,
    })
    .from(mapsTable)
    .where(and(eq(mapsTable.type, 'official'), eq(mapsTable.isPublished, true)))
    .orderBy(
      sql`CASE
            WHEN ${mapsTable.id} = ${OFFICIAL_MAP_WORLD_ID} THEN 0
            ELSE 1
          END`,
      asc(mapsTable.name),
    )
    .offset(offset)
    .limit(limit)

  return maps
}
