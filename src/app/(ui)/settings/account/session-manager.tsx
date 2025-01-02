import { redirect } from 'next/navigation'

import {
  getCurrentSession,
  type APISession,
  type Session,
} from '@/lib/session.js'

import { snakeCaseToCamelCase } from '@/utils/index.js'
import { createClient } from '@/utils/supabase/server.js'

import SignOutAllSessionsForm from './SignOutAllSessionsForm.js'
import SessionItem from './session-item.js'

const SessionManager = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/settings/account')

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: sessions } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .gte('expires_at', new Date().toISOString())
    .neq('id', session.id)
    .returns<APISession[]>()

  return (
    <div>
      <div>
        <div>Current Session</div>
        <SessionItem session={session} />
      </div>
      <div>
        <div>Other Sessions</div>
        {sessions && sessions.length > 0
          ? sessions.map((s) => (
              <SessionItem
                key={s.id}
                session={{
                  ...snakeCaseToCamelCase<Session>(s),
                  createdAt: new Date(s.created_at),
                  expiresAt: new Date(s.expires_at),
                }}
              />
            ))
          : 'No sessions'}
      </div>
      <SignOutAllSessionsForm />
    </div>
  )
}

export default SessionManager
