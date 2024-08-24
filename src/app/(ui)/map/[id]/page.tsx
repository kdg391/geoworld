'use server'

import { Earth, Scale, UsersRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { getMap, hasLiked } from '@/actions/map.js'
import { getProfile } from '@/actions/profile.js'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import { createClient } from '@/utils/supabase/server.js'

import styles from './page.module.css'
import './page.css'

const EditButton = dynamic(() => import('./EditButton.js'))
const LikeButton = dynamic(() => import('./LikeButton.js'))
const PlayButton = dynamic(() => import('./PlayButton.js'))
const Twemoji = dynamic(() => import('@/components/Twemoji.js'))

interface Props {
  params: {
    id: string
  }
}

const Map = async ({ params }: Props) => {
  'use server'

  const { t } = await createTranslation(['translation', 'map'])

  const { data: mapData, error: mErr } = await getMap(params.id)

  if (!mapData || mErr)
    return (
      <main>
        <section>
          <h1>Map Not Found</h1>
        </section>
      </main>
    )

  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: creator, error: cErr } = await getProfile(mapData.creator)

  if (!creator || cErr)
    return (
      <section>
        <h1>{"Can't load the creator data"}</h1>
      </section>
    )

  const { data: leaderboardData, error: lErr } = await supabase
    .rpc('get_ranked_games', {
      p_map_id: mapData.id,
    })
    .select('*')

  if (!leaderboardData || lErr) return

  const { data: liked } = await hasLiked(mapData.id)

  return (
    <>
      <section>
        <div>
          <h1 className={styles.title}>
            {mapData.type === 'official' && (
              <Twemoji
                emoji={
                  mapData.id === OFFICIAL_MAP_WORLD_ID
                    ? WORLD_EMOJI
                    : FLAG_ENOJIS[OFFICIAL_MAP_COUNTRY_CODES[mapData.id]]
                }
                alt={mapData.name}
                width={24}
                height={24}
              />
            )}
            {mapData.name}
          </h1>
          <p>{t(`mapType.${mapData.type}`)}</p>
          <p>{mapData.description}</p>
          <div>
            <span>
              Created by{' '}
              <Link href={`/user/${mapData.creator}`}>
                {creator.display_name}
              </Link>
            </span>
          </div>
          <p>Updated {new Date(mapData.updated_at).toLocaleDateString()}</p>
        </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <Scale size={24} />
            <div>
              <div>{mapData.average_score.toLocaleString()}</div>
              <div>{t('avgScore')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <UsersRound size={24} />
            <div>
              <div>{mapData.explorers.toLocaleString()}</div>
              <div>{t('explorers')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <Earth size={24} />
            <div>
              <div>{mapData.locations_count.toLocaleString()}</div>
              <div>
                {t('locations', {
                  count: mapData.locations_count,
                })}
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <LikeButton defaultLiked={liked} mapId={mapData.id} />
            <div>
              <div>{mapData.likes.toLocaleString()}</div>
              <div>{t('likes')}</div>
            </div>
          </div>
        </div>
        <div>
          <PlayButton mapData={mapData} userId={user?.id} />
          {mapData.creator === user?.id && <EditButton mapId={mapData.id} />}
        </div>
      </section>
      <section>
        <h2>Leaderboard</h2>
        {leaderboardData.length > 0 ? (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>User</th>
                <th>Score</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData?.map((l) => (
                <tr key={l.id}>
                  <td>{l.rank}</td>
                  <td>
                    <Link href={`/user/${l.user_id}`}>{l.display_name}</Link>
                  </td>
                  <td>{l.total_score}</td>
                  <td>{l.total_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No data</p>
        )}
      </section>
    </>
  )
}

export default Map
