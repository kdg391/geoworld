'use client'

import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.js'

const Button = dynamic(() => import('@/components/common/Button/index.js'))

const PlayButton = () => {
  const router = useRouter()

  const { t } = useTranslation('common')

  return (
    <Button
      variant="primary"
      size="m"
      onClick={() => router.push('/dashboard')}
    >
      {t('get_started')}
      <ArrowRight size={16} />
    </Button>
  )
}

export default PlayButton
