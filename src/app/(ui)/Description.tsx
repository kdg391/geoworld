'use client'

import { Trans } from 'react-i18next'

import { useTranslation } from '@/i18n/client.js'

const Description = () => {
  const { t } = useTranslation('common')

  return <Trans i18nKey="hero.desc" t={t} />
}

export default Description
