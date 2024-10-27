import { notFound, redirect } from 'next/navigation'

import { getProfileByUsername } from '@/actions/profile.js'

interface Props {
  params: Promise<{
    id: string
  }>
}

const User = async (props: Props) => {
  const params = await props.params

  const id = decodeURIComponent(params.id)

  if (id.startsWith('@')) {
    const { data: profile, error: profileErr } = await getProfileByUsername(
      id.slice(1),
    )

    if (!profile || profileErr) notFound()

    redirect(`/user/${profile.id}`)
  }

  const { data: profile, error: profileErr } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/users/${params.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

  if (!profile || profileErr) notFound()

  return (
    <section>
      <h1>{profile.display_name}</h1>
      <p>@{profile.username}</p>
    </section>
  )
}

export default User
