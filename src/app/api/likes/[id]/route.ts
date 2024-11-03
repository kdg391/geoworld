import { auth } from '@/auth.js'

import { createClient } from '@/utils/supabase/server.js'

export const GET = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const session = await auth()

  if (!session)
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('map_id', params.id)
    .maybeSingle()

  if (error)
    return Response.json(
      {
        error: 'Database Error',
      },
      {
        status: 500,
      },
    )

  return Response.json({
    data: data !== null,
  })
}

export const POST = async (
  _: Request,
  segmentData: { params: Promise<{ id: string }> },
) => {
  const session = await auth()

  if (!session)
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', session.user.id)
    .eq('map_id', params.id)
    .maybeSingle()

  if (data !== null)
    return Response.json({
      error: 'The map is already liked.',
    })

  const { error } = await supabase.from('likes').insert({
    map_id: params.id,
    user_id: session.user.id,
  })

  if (error)
    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    )

  return Response.json({
    data: true,
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
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const params = await segmentData.params

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', session.user.id)
    .eq('map_id', params.id)
    .maybeSingle()

  if (data === null)
    return Response.json({
      error: 'The map is not liked.',
    })

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', session.user.id)
    .eq('map_id', params.id)

  if (error)
    return Response.json(
      {
        error: 'Database Error',
      },
      {
        status: 500,
      },
    )

  return Response.json({
    data: true,
  })
}
