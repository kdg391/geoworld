import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getProfile } from '@/actions/profile.ts'

import { createTranslation } from '@/i18n/server.ts'

import { getCurrentSession } from '@/lib/session.ts'

const Dashboard = async () => {
  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  const { data: profile } = await getProfile(user.id)

  if (
    profile === null ||
    profile.displayName === null ||
    profile.username === null
  )
    redirect('/setup-profile')

  const { t } = await createTranslation('common')

  return (
    <div>
      <aside>
        <ul>
          <li>
            <Link href="/single-player">{t('single_player')}</Link>
          </li>
          <li>
            <Link href="/multi-player">{t('multi_player')}</Link>
          </li>
          <li>
            <Link href="/maps">{t('classic_maps')}</Link>
          </li>
        </ul>
      </aside>
      <div></div>
    </div>
  )
}

export default Dashboard
