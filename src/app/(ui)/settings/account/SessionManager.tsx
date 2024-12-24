import {
  Gamepad,
  Laptop,
  Smartphone,
  TabletSmartphone,
  TvMinimal,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { UAParser } from 'ua-parser-js'

import {
  getCurrentSession,
  type APISession,
  type Session,
} from '@/lib/session.js'

import { formatRelativeTime, snakeCaseToCamelCase } from '@/utils/index.js'
import { createClient } from '@/utils/supabase/server.js'

import SignOutAllSessionsForm from './SignOutAllSessionsForm.js'

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
        {sessions
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

const SessionItem = ({ session }: { session: Session }) => {
  const parsedUA = session.userAgent
    ? new UAParser(session.userAgent).getResult()
    : null

  const relativeTime = formatRelativeTime(session.createdAt)

  return (
    <div>
      {parsedUA && (
        <div
          style={{
            display: 'flex',
          }}
        >
          {parsedUA.device.type === 'mobile' ? (
            <Smartphone size={16} />
          ) : parsedUA.device.type === 'tablet' ? (
            <TabletSmartphone size={16} />
          ) : parsedUA.device.type === 'console' ? (
            <Gamepad size={16} />
          ) : parsedUA.device.type === 'smarttv' ? (
            <TvMinimal size={16} />
          ) : (
            <Laptop size={16} />
          )}
          <div>{`${parsedUA.browser.name}, ${parsedUA.os.name}`}</div>
        </div>
      )}
      <div>{relativeTime}</div>

      <form action={undefined}>
        <button type="submit">Sign Out</button>
      </form>
    </div>
  )
}

export default SessionManager
