'use server'

import { createClient } from '../utils/supabase/server.js'

import type { Profile } from '../types/index.js'

export const getProfile = async (id: string) => {
  'use server'
  const supabase = createClient()

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single<Profile>()

  return {
    data,
    error: error?.message ?? null,
  }
}
