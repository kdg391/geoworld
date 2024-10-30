import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = () =>
  createSupabaseClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
    {
      db: {
        schema: 'next_auth',
      },
      auth: {
        persistSession: false,
      },
    },
  )
