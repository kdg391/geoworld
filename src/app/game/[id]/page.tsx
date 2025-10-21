'use server'

import { redirect } from 'next/navigation'
import ClientPage from './page.client.tsx'

import { getCurrentSession } from '@/lib/session.ts'

interface Props {
  params: Promise<{
    id: string
  }>
}

const Page = async (props: Props) => {
  const params = await props.params

  const { session } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  return <ClientPage params={params} />
}

export default Page
