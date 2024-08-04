import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { getProfile } from '../../../actions/profile.js'

import { createClient } from '../../../utils/supabase/server.js'

const DisplayNameForm = dynamic(() => import('./DisplayNameForm.js'))
const UsernameForm = dynamic(() => import('./UsernameForm.js'))

const Profile = async () => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) return redirect('/sign-in')

  const { data: pData, error: pErr } = await getProfile(user.id)

  if (!pData || pErr) return redirect('/sign-in')

  return (
    <section>
      <h2>Profile</h2>
      <div>
        <DisplayNameForm displayName={pData.display_name} />
      </div>
      <div>
        <UsernameForm username={pData.username} />
      </div>
    </section>
  )
}

export default Profile
