'use server'

import { Earth, Heart, Scale, UsersRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'

import { getMap } from '../../../actions/map.js'
import { getProfile } from '../../../actions/profile.js'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '../../../constants/index.js'

import { createTranslation } from '../../../i18n/server.js'

import { createClient } from '../../../utils/supabase/server.js'

import styles from './page.module.css'
import './page.css'

const EditButton = dynamic(() => import('./EditButton.js'))
const Header = dynamic(() => import('../../../components/Header/index.js'))
const PlayButton = dynamic(() => import('./PlayButton.js'))
const Twemoji = dynamic(() => import('../../../components/Twemoji.js'))

interface Props {
  params: {
    id: string
  }
}

const Map = async ({ params }: Props) => {
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

  const { data: userData } = await supabase.auth.getUser()

  const { data: creator, error: cErr } = await getProfile(mapData.creator)

  if (!creator || cErr)
    return (
      <main>
        <section>
          <h1>{"Can't load the creator data"}</h1>
        </section>
      </main>
    )

  return (
    <>
      <Header />

      <main className={styles.main}>
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
                  alt="Flag"
                  width={24}
                  height={24}
                />
              )}
              {mapData.type === 'official'
                ? mapData.id === OFFICIAL_MAP_WORLD_ID
                  ? t('world')
                  : t(`country.${OFFICIAL_MAP_COUNTRY_CODES[mapData.id]}`)
                : mapData.name}
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
                <div>{t('averageScore')}</div>
              </div>
            </div>
            <div className={styles.card}>
              <UsersRound size={24} />
              <div>
                <div>0</div>
                <div>Explorers</div>
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
              <Heart size={24} />
              <div>
                <div>0</div>
                <div>Likes</div>
              </div>
            </div>
          </div>
          <div>
            <PlayButton mapData={mapData} userId={userData.user?.id} />
            {mapData.creator === userData.user?.id && (
              <EditButton mapId={mapData.id} />
            )}
          </div>
        </section>
        <section>
          <h2>Leaderboard</h2>
        </section>
      </main>
    </>
  )
}

export default Map
