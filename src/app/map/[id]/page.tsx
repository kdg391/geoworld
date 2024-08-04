'use server'

import { Earth, Heart, Scale, UsersRound } from 'lucide-react'
import dynamic from 'next/dynamic'

import { getMap } from '../../../actions/map.js'

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

const Map = async ({ params }: { params: { id: string } }) => {
  const { t } = await createTranslation('translation')

  const supabase = createClient()

  const { data: userData } = await supabase.auth.getUser()
  const { data: mapData, error: mErr } = await getMap(params.id)

  if (!mapData || mErr)
    return (
      <main>
        <section>
          <h1>Map Not Found</h1>
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
              <span>Created by {mapData.creator}</span>
            </div>
            <p>Updated {new Date(mapData.updated_at).toLocaleDateString()}</p>
          </div>
          <div className={styles.cards}>
            <div className={styles.card}>
              <Scale size={24} />
              <div>
                <div>0</div>
                <div>Average Score</div>
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
                <div>Locations</div>
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
