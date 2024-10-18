import Link from 'next/link'
import { redirect } from 'next/navigation'

import { auth } from '@/auth.js'

import { createTranslation } from '@/i18n/server.js'

import type { Profile } from '@/types/index.js'

const Dashboard = async () => {
  const session = await auth()

  if (!session) redirect('/sign-in')

  const { data: profile } = (await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/users/${session.user.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())) as { data: Profile | null }

  if (!profile) redirect('/sign-in')

  if (!profile.display_name || !profile.username) redirect('/setup-profile')

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
