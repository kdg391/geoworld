import { redirect } from 'next/navigation'

import GoogleApiProvider from '../../../providers/GoogleApiProvider.js'

import { createClient } from '../../../utils/supabase/server.js'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Game - GeoWorld',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()

  if (!uData.user || uErr) redirect('/sign-in')

  return <GoogleApiProvider>{children}</GoogleApiProvider>
}
