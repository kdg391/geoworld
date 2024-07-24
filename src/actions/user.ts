'use server'

import { createClient } from '../utils/supabase/server.js'

export const getUser = async () => {
  'use server'
  const supabase = createClient()

  const { data, error } = await supabase.auth.getUser()

  return {
    data,
    error: error?.message ?? null,
  }
}
