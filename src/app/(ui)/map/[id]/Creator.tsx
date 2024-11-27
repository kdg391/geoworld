'use client'

import Link from 'next/link'
import { Trans } from 'react-i18next'

import { useTranslation } from '@/i18n/client.js'

interface Props {
  id: string
}

const Creator = ({ id }: Props) => {
  const { t } = useTranslation('map')

  return (
    <Trans
      i18nKey="created"
      components={[<Link key={0} href={`/user/${id}`} />]}
      t={t}
    />
  )
}

export default Creator
