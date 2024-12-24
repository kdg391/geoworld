import { redirect } from 'next/navigation'

import { getCurrentSession } from '@/lib/session.js'

import ClientPage from './page.client.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = async (props: Props) => {
  const params = await props.params

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  return <ClientPage params={params} user={user} />
}

export default Page
