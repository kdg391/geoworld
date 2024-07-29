import { redirect } from 'next/navigation'

import { createClient } from '../../../utils/supabase/server.js'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - GeoWorld',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  if (data.user) redirect('/')

  return children
}
