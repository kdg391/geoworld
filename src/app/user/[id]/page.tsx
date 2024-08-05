import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getProfile, getProfileByUsername } from '../../../actions/profile.js'

interface Params {
  params: {
    id: string
  }
}

const User = async ({ params }: Params) => {
  const id = decodeURIComponent(params.id)

  if (id.startsWith('@')) {
    const { data: pData, error: pErr } = await getProfileByUsername(id.slice(1))

    if (!pData || pErr)
      return (
        <section>
          <h1>User Not Found</h1>
          <Link href="/">Go to Home</Link>
        </section>
      )

    redirect(`/user/${pData.id}`)
  }

  const { data: pData, error: pErr } = await getProfile(params.id)

  if (!pData || pErr)
    return (
      <section>
        <h1>User Not Found</h1>
        <Link href="/">Go to Home</Link>
      </section>
    )

  return (
    <section>
      <h1>{pData.display_name}</h1>
      <p>@{pData.username}</p>
    </section>
  )
}

export default User
