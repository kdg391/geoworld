import { createTranslation } from '@/i18n/server.js'

export const generateMetadata = async () => {
  const { t } = await createTranslation('common')

  return {
    title: `${t('liked_maps')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
