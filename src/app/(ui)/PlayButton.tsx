'use client'

import { ArrowRight } from 'lucide-react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'

import { useTranslation } from '@/i18n/client.ts'

const Button = dynamic(() =>
  import('@/components/ui/button.tsx').then((m) => m.Button),
)

const PlayButton = () => {
  const router = useRouter()

  const { t } = useTranslation('common')

  return (
    <Button size="sm" onClick={() => router.push('/dashboard')}>
      {t('get_started')}
      <ArrowRight size={16} />
    </Button>
  )
}

export default PlayButton
