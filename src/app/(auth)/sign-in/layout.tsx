import { redirect } from 'next/navigation'

import { createTranslation } from '../../../i18n/server.js'

import { createClient } from '../../../utils/supabase/server.js'

import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  const { t } = await createTranslation('auth')

  return {
    title: `${t('signIn')} - GeoWorld`,
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
  } = await supabase.auth.getUser()

  if (user) redirect('/')

  return children
}
