import { z } from 'zod'

import { getRankedGames } from '@/actions/game.ts'
import { camelCaseToSnakeCase } from '@/utils/casing.ts'

import type { NextRequest } from 'next/server'

const schema = z.object({
  count: z.number().min(1).max(100).default(10),
  id: z.string(),
})

export const GET = async (
  request: NextRequest,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const params = await segmentData.params

  const searchParams = request.nextUrl.searchParams
  const count = searchParams.get('count')

  const validated = await schema.safeParseAsync({
    count: count ? parseInt(count) : undefined,
    id: params.id,
  })

  if (!validated.success)
    return Response.json(
      {
        errors: z.flattenError(validated.error).fieldErrors,
      },
      {
        status: 400,
      },
    )

  const data = await getRankedGames({
    count: validated.data.count,
    mapId: validated.data.id,
  })

  return Response.json({
    data: camelCaseToSnakeCase(data),
  })
}
