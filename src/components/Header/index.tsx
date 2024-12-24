'use server'

import { getCurrentSession } from '@/lib/session.js'

import ClientHeader from './index.client.js'

const Header = async () => {
  const { session, user } = await getCurrentSession()

  return <ClientHeader session={session} user={user} />
}

export default Header
