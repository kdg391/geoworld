import { redirect } from 'next/navigation'

import { getProfile } from '../../../../actions/profile.js'

import GoogleApiProvider from '../../../../providers/GoogleApiProvider.js'

import { createClient } from '../../../../utils/supabase/server.js'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Map - GeoWorld',
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const { data: uData, error: uErr } = await supabase.auth.getUser()
  if (!uData.user || uErr) return redirect('/')

  const { data: pData, error: pErr } = await getProfile(uData.user.id)
  if (!pData || pErr) return redirect('/')

  return <GoogleApiProvider>{children}</GoogleApiProvider>
}
