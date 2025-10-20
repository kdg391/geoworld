'use server'

import { getCurrentSession } from '@/lib/session.ts'

import ClientHeader from './index.client.tsx'

const Header = async () => {
  const { session, user } = await getCurrentSession()

  return <ClientHeader session={session} user={user} />
}

export default Header
