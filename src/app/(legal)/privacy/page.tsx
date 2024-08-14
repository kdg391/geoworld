import { createTranslation } from '@/i18n/server.js'

const PrivacyPolicy = async () => {
  const { t } = await createTranslation('translation')

  return (
    <section>
      <h1>{t('privacyPolicy')}</h1>
    </section>
  )
}

export default PrivacyPolicy
