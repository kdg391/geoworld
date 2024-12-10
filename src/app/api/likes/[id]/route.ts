import { getCurrentSession } from '@/session.js'

import { createClient } from '@/utils/supabase/server.js'

export const GET = async (
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

  const { data, error } = await supabase
    .from('likes')
    .select('*')
    .eq('user_id', user.id)
    .eq('map_id', params.id)
    .maybeSingle()

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
    data: data !== null,
  })
}

export const POST = async (
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

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('map_id', params.id)
    .maybeSingle()

  if (data !== null)
    return Response.json(
      {
        errors: {
          message: 'The map is already liked.',
        },
      },
      {
        status: 500,
      },
    )

  const { error } = await supabase.from('likes').insert({
    map_id: params.id,
    user_id: user.id,
  })

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
    data: true,
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

  const { data } = await supabase
    .from('likes')
    .select()
    .eq('user_id', user.id)
    .eq('map_id', params.id)
    .maybeSingle()

  if (data === null)
    return Response.json(
      {
        errors: {
          message: 'The map is not liked.',
        },
      },
      {
        status: 500,
      },
    )

  const { error } = await supabase
    .from('likes')
    .delete()
    .eq('user_id', user.id)
    .eq('map_id', params.id)

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
    data: true,
  })
}
