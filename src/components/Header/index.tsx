'use server'

import { auth } from '@/auth.js'

import HeaderClient from './HeaderClient.js'

const Header = async () => {
  const session = await auth()

  return <HeaderClient session={session} />
}

export default Header
