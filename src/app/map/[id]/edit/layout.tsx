import { redirect } from 'next/navigation'

import GoogleApiProvider from '@/providers/GoogleApiProvider.js'

import { createClient } from '@/utils/supabase/server.js'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Edit Map - GeoWorld',
  }
}

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/')

  return <GoogleApiProvider>{children}</GoogleApiProvider>
}
