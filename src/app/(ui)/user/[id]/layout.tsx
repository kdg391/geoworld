import { getProfile } from '@/actions/profile.js'

import { createTranslation } from '@/i18n/server.js'

import type { Metadata } from 'next'

interface Props {
  params: Promise<{
    id: string
  }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params

  if (decodeURIComponent(params.id).startsWith('@')) return {}

  const { t } = await createTranslation('common')

  const { data: profile } = await getProfile(params.id)

  if (!profile)
    return {
      title: `${t('user')} - GeoWorld`,
    }

  return {
    title: `${profile.displayName} - ${t('user')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main>{children}</main>
    </>
  )
}
