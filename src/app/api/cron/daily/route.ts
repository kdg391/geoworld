// import { OFFICIAL_MAP_WORLD_ID } from '@/constants/index.js'

// import { createClient } from '@/utils/supabase/server.js'

// const ADMIN_ID = 'f5aa9d4b-5bc7-4cff-841b-7d3112a8eb90'

export async function GET(request: Request) {
  if (
    request.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return Response.json(
      {
        message: 'Unauthorized',
      },
      {
        status: 401,
      },
    )
  }

  return Response.json(
    { message: 'Work in progress' },
    {
      status: 500,
    },
  )

  /*const supabase = createClient()

  const date = new Date()
  const today = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`

  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('is_daily_challenge', true)
    .eq('created_at', today)
    .maybeSingle()

  if (error)
    return Response.json(
      { message: 'Something went wrong' },
      {
        status: 500,
      },
    )

  if (data !== null)
    return Response.json(
      { message: 'Already created' },
      {
        status: 500,
      },
    )

  const { error: iErr } = await supabase.from('challenges').insert({
    map_id: OFFICIAL_MAP_WORLD_ID,
    user_id: ADMIN_ID,
    is_daily_challenge: true,
    settings: {
      canMove: true,
      canPan: true,
      canZoom: true,
      rounds: 5,
      timeLimit: 120,
    },
    locations: [],
  })

  return Response.json({ success: true })*/
}
