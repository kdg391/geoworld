import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/session.js'

import P from './p.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = async (props: Props) => {
  const params = await props.params

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  return <P params={params} session={session} user={user} />
}

export default Page
