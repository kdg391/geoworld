'use server'

import dynamic from 'next/dynamic'
import { redirect } from 'next/navigation'

import { getProfile } from '../../../actions/profile.js'

import { createClient } from '../../../utils/supabase/server.js'

const EmailForm = dynamic(() => import('./EmailForm.js'))
const DisplayNameForm = dynamic(() => import('./DisplayNameForm.js'))
const PasswordForm = dynamic(() => import('./PasswordForm.js'))

const Settings = async () => {
  'use server'
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) return redirect('/sign-in')

  const { data: profileData, error: pErr } = await getProfile(user.id)

  if (!profileData || pErr) return redirect('/sign-in')

  return (
    <section>
      <h1>Settings</h1>

      <EmailForm email={user.email} />
      <DisplayNameForm displayName={profileData.display_name} />
      <PasswordForm />

      <div>
        <button disabled>Delete Account</button>
        <span>(to be supported)</span>
      </div>
    </section>
  )
}

export default Settings
