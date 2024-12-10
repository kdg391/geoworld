import { notFound, redirect } from 'next/navigation'

import { getProfile, getProfileByUsername } from '@/actions/profile.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const User = async (props: Props) => {
  const params = await props.params

  const id = decodeURIComponent(params.id)

  if (id.startsWith('@')) {
    const { data: profile } = await getProfileByUsername(id.slice(1))

    if (!profile) notFound()

    redirect(`/user/${profile.id}`)
  }

  const { data: profile } = await getProfile(params.id)

  if (!profile) notFound()

  return (
    <section>
      <h1>{profile.displayName}</h1>
      <p>@{profile.username}</p>
    </section>
  )
}

export default User
