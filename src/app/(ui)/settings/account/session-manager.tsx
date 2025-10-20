import { and, eq, gt, ne } from 'drizzle-orm'
import { redirect } from 'next/navigation'

import { db } from '@/db/index.ts'
import { sessionsTable } from '@/db/schema.ts'
import { getCurrentSession } from '@/lib/session.ts'

import SessionItem from './session-item.tsx'
import SignOutAllSessionsForm from './SignOutAllSessionsForm.tsx'

const SessionManager = async () => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in?next=/settings/account')

  const sessions = await db
    .select()
    .from(sessionsTable)
    .where(
      and(
        eq(sessionsTable.userId, user.id),
        gt(sessionsTable.expiresAt, new Date()),
        ne(sessionsTable.id, session.id),
      ),
    )

  return (
    <div>
      <div>
        <div>Current Session</div>
        <SessionItem session={session} />
      </div>
      <div>
        <div>Other Sessions</div>
        {sessions && sessions.length > 0
          ? sessions.map((s) => <SessionItem key={s.id} session={session} />)
          : 'No sessions'}
      </div>
      <SignOutAllSessionsForm />
    </div>
  )
}

export default SessionManager
