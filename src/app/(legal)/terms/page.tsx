import { createTranslation } from '@/i18n/server.js'

const TermsOfService = async () => {
  const { t } = await createTranslation('translation')

  return (
    <section>
      <h1>{t('termsOfService')}</h1>
    </section>
  )
}

export default TermsOfService
