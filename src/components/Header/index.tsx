'use server'

import { getCurrentSession } from '@/session.js'

import HeaderClient from './HeaderClient.js'

const Header = async () => {
  const { session, user } = await getCurrentSession()

  return <HeaderClient session={session} user={user} />
}

export default Header
