import { getCurrentSession } from '@/lib/session'
import { redirect } from 'next/navigation'

const Admin = async () => {
  const { session } = await getCurrentSession()

  if (!session) return redirect('/sign-in')

  return (
    <div>
      <h1>관리자 페이지</h1>
    </div>
  )
}

export default Admin
