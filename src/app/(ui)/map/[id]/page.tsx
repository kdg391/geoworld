'use server'

import { BadgeCheck, Earth, Scale, UsersRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getLike, getMap } from '@/actions/map.js'
import { getProfile } from '@/actions/profile.js'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import { getCurrentSession } from '@/lib/session.js'

import styles from './page.module.css'

import './page.css'

const DeleteButton = dynamic(() => import('./DeleteButton.js'))
const EditButton = dynamic(() => import('./EditButton.js'))
const LikeButton = dynamic(() => import('./LikeButton.js'))
const MapLeaderboard = dynamic(
  () => import('@/components/MapLeaderboard/index.js'),
)
const PlayButton = dynamic(() => import('./PlayButton.js'))
const Twemoji = dynamic(() => import('@/components/Twemoji.js'))

interface Props {
  params: Promise<{
    id: string
  }>
}

const Map = async (props: Props) => {
  'use server'

  const params = await props.params

  const { data: mapData } = await getMap(params.id)

  if (!mapData) notFound()

  const { data: creator } = await getProfile(mapData.creator)
  const { data: liked } = await getLike(mapData.id)

  const { user } = await getCurrentSession()

  const { t } = await createTranslation(['common', 'map'])

  return (
    <>
      <section>
        <div>
          <div className={styles['map-info']}>
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
            <div>
              <h1 className={styles.name}>{mapData.name}</h1>
              {mapData.type === 'official' && (
                <BadgeCheck
                  size={24}
                  fill="var(--primary)"
                  stroke="var(--bg)"
                />
              )}
            </div>
          </div>
          <p className={styles.description}>{mapData.description}</p>
          {creator && (
            <div>
              <span>
                Created by{' '}
                <Link href={`/user/${mapData.creator}`}>
                  {creator.displayName}
                </Link>
              </span>
            </div>
          )}
          <p>
            {t('updated', {
              ns: 'map',
              val: new Date(mapData.updatedAt),
              formatParams: {
                val: {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                },
              },
            })}
          </p>
        </div>
        <div className={styles.cards}>
          <div className={styles.card}>
            <Scale size={24} />
            <div>
              <div>{mapData.averageScore.toLocaleString()}</div>
              <div>{t('map:avg_score')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <UsersRound size={24} />
            <div>
              <div>{mapData.explorersCount.toLocaleString()}</div>
              <div>{t('map:explorers')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <Earth size={24} />
            <div>
              <div>{mapData.locationsCount.toLocaleString()}</div>
              <div>
                {t('locations', {
                  count: mapData.locationsCount,
                  ns: 'map',
                })}
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <LikeButton defaultLiked={liked} mapId={mapData.id} />
            <div>
              <div>{mapData.likesCount.toLocaleString()}</div>
              <div>
                {t('likes', {
                  ns: 'map',
                })}
              </div>
            </div>
          </div>
        </div>
        <div>
          <PlayButton mapData={mapData} userId={user?.id} />
          {mapData.creator === user?.id && (
            <div className="flex">
              <EditButton mapId={mapData.id} />
              <DeleteButton mapId={mapData.id} />
            </div>
          )}
        </div>
      </section>
      <section>
        <h2>{t('map:leaderboard')}</h2>
        <MapLeaderboard mapId={mapData.id} />
      </section>
    </>
  )
}

export default Map
