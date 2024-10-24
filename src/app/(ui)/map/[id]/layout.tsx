import { createTranslation } from '@/i18n/server.js'

import type { Metadata } from 'next'

import styles from './page.module.css'

export const revalidate = 60

export const generateMetadata = async ({
  params,
}: {
  params: {
    id: string
  }
}): Promise<Metadata> => {
  const { t } = await createTranslation('common')

  const { data: mapData, error: mErr } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/${params.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

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
