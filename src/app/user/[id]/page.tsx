import Link from 'next/link'

import { getProfile } from '../../../actions/profile.js'

const User = async ({ params }: { params: { id: string } }) => {
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
    </section>
  )
}

export default User
