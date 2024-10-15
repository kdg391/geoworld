import { auth } from '@/auth'
import { createTranslation } from '@/i18n/server'
import { Profile } from '@/types'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'

const Dashboard = async () => {
  const session = await auth()

  if (!session) redirect('/sign-in')

  const { t } = await createTranslation('common')

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single<Profile>()

  if (!profile) redirect('/sign-in')

  if (!profile.display_name || !profile.username) redirect('/setup-profile')

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
