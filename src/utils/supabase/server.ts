import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export const createClient = ({
  serviceRole = false,
  supabaseAccessToken,
}: {
  serviceRole?: boolean
  supabaseAccessToken?: string
} = {}) =>
  createSupabaseClient(
    process.env.SUPABASE_URL as string,
    (serviceRole
      ? process.env.SUPABASE_SERVICE_ROLE_KEY
      : process.env.SUPABASE_ANON_KEY) as string,
    {
      db: {
        schema: 'lucia_auth',
      },
      ...(supabaseAccessToken
        ? {
            global: {
              headers: {
                Authorization: `Bearer ${supabaseAccessToken}`,
              },
            },
          }
        : {}),
      auth: {
        persistSession: false,
      },
    },
  )
