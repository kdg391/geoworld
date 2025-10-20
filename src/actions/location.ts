'use server'

import { eq, sql } from 'drizzle-orm'

import { db } from '@/db/index.ts'
import { locationsTable } from '@/db/schema.ts'

import type { Location } from '@/types/location.ts'

export const getLocations = async (mapId: string) => {
  'use server'

  const data = await db
    .select()
    .from(locationsTable)
    .where(eq(locationsTable.mapId, mapId))

  return {
    data,
    errors: null,
  }
}

/*
CREATE OR REPLACE FUNCTION geoworld.get_random_locations(p_map_id uuid DEFAULT NULL, p_count INT DEFAULT 5)
RETURNS TABLE (
    created_at timestamptz,
    map_id uuid,
    user_id uuid,
    lat numeric,
    lng numeric,
    heading float8,
    pano_id text,
    pitch float8,
    zoom float8,
    streak_location_code text
)
security definer set search_path = ''
as $$
BEGIN
    RETURN QUERY
    SELECT l.created_at, l.map_id, l.user_id, l.lat, l.lng, l.heading, l.pano_id, l.pitch, l.zoom, l.streak_location_code
    FROM geoworld.locations l
    WHERE (p_map_id IS NULL OR l.map_id = p_map_id)
    ORDER BY RANDOM()
    LIMIT p_count;
END;
$$ LANGUAGE plpgsql;
*/
export async function getRandomLocations(options: {
  mapId: string | null
  count: 1
}): Promise<Omit<Location, 'id'> | null>
export async function getRandomLocations(options: {
  mapId: string | null
  count?: number
}): Promise<Omit<Location, 'id'>[]>
export async function getRandomLocations({
  mapId = null,
  count = 5,
}: {
  mapId: string | null
  count?: number
}): Promise<Omit<Location, 'id'> | Omit<Location, 'id'>[] | null> {
  const locations = await db
    .select({
      createdAt: locationsTable.createdAt,
      mapId: locationsTable.mapId,
      userId: locationsTable.userId,
      lat: locationsTable.lat,
      lng: locationsTable.lng,
      heading: locationsTable.heading,
      panoId: locationsTable.panoId,
      pitch: locationsTable.pitch,
      zoom: locationsTable.zoom,
      streakLocationCode: locationsTable.streakLocationCode,
    })
    .from(locationsTable)
    .where(mapId !== null ? eq(locationsTable.mapId, mapId) : undefined)
    .orderBy(sql`RANDOM()`)
    .limit(count)

  if (count === 1) {
    return locations?.[0] ?? null
  }

  return locations
}
