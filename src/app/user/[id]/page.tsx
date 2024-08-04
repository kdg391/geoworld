import Link from 'next/link'

import { getProfile } from '../../../actions/profile.js'

interface Params {
  params: {
    id: string
  }
}

const User = async ({ params }: Params) => {
  if (params.id.startsWith('@')) return // todo

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
