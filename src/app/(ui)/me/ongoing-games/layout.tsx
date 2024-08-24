import { createTranslation } from '@/i18n/server.js'

export const generateMetadata = async () => {
  const { t } = await createTranslation('translation')

  return {
    title: `${t('ongoingGames')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
