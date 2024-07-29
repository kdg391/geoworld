'use server'

import { redirect } from 'next/navigation'

import { getOfficialMaps } from '../../actions/map.js'
import { getProfile } from '../../actions/profile.js'

import { createClient } from '../../utils/supabase/server.js'

const Admin = async () => {
  const supabase = createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (!user || error) return redirect('/')

  const { data: pData, error: pErr } = await getProfile(user.id)

  if (!pData || pErr) return redirect('/')
  if (!pData.is_admin) return redirect('/')

  const { data: mapData, error: mErr } = await getOfficialMaps(0)

  if (!mapData || mErr) return redirect('/')

  return (
    <section>
      <h1>Admin</h1>
      <h2>Official Maps</h2>
      <div>
        {mapData.map((map) => (
          <div key={map.id}>
            <h3>{map.name}</h3>
            <p>{map.locations_count} Locations</p>
            <button>Edit</button>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Admin
