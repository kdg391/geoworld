import { createTranslation } from '@/i18n/server.ts'

export const generateMetadata = async () => {
  const { t } = await createTranslation('common')

  return {
    title: `${t('my_maps')} - GeoWorld`,
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
