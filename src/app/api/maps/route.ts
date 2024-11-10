import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

import { createMapSchema } from '@/utils/validations/map.js'

import type { Map } from '@/types/index.js'

export const POST = async (request: Request) => {
  'use server'

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
