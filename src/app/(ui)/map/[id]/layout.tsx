import { getMap } from '@/actions/map.js'

import { createTranslation } from '@/i18n/server.js'

import styles from './page.module.css'

import type { Metadata } from 'next'

export const revalidate = 60

interface Props {
  params: Promise<{
    id: string
  }>
}

export const generateMetadata = async (props: Props): Promise<Metadata> => {
  const params = await props.params

  const { data: mapData, errors: mErr } = await getMap(params.id)

  const { t } = await createTranslation('common')

  if (!mapData || mErr)
    return {
      title: `${t('map')} - GeoWorld`,
    }

  return {
    title: `${mapData.name} - ${t('map')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className={styles.main}>{children}</main>
    </>
  )
}
