import { getCurrentSession } from '@/lib/session.js'

import { createClient } from '@/utils/supabase/server.js'

import { createMapSchema } from '@/utils/validations/map.js'

import type { APIMap } from '@/types/map.js'

export const POST = async (request: Request) => {
  'use server'

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

  const body = await request.json()

  const validated = await createMapSchema.safeParseAsync({
    name: body.name,
    description: body.description,
  })

  if (!validated.success)
    return Response.json(
      {
        message: 'Invalid Form Body',
        errors: validated.error.flatten().fieldErrors,
      },
      {
        status: 400,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data, error } = await supabase
    .from('maps')
    .insert<Partial<APIMap>>({
      type: 'community',
      name: validated.data.name,
      description:
        validated.data.description === '' ? null : validated.data.description,
      is_published: false,
      creator: user.id,
    })
    .select()
    .single<APIMap>()

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

  return Response.json({
    data,
    message: 'Successfully created the map',
  })
}
