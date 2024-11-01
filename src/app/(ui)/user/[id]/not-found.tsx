'use client'

import Link from 'next/link'

import { createTranslation } from '@/i18n/server.js'

const NotFound = async () => {
  const { t } = await createTranslation('common')

  return (
    <section>
      <h1>User Not Found</h1>
      <Link href="/">{t('back_to_home')}</Link>
    </section>
  )
}

export default NotFound
