'use server'

import { Earth, Scale, UsersRound } from 'lucide-react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { auth } from '@/auth.js'

import { hasLiked } from '@/actions/map.js'

import {
  FLAG_ENOJIS,
  OFFICIAL_MAP_COUNTRY_CODES,
  OFFICIAL_MAP_WORLD_ID,
  WORLD_EMOJI,
} from '@/constants/index.js'

import { createTranslation } from '@/i18n/server.js'

import styles from './page.module.css'

import './page.css'

const EditButton = dynamic(() => import('./EditButton.js'))
const Leaderboard = dynamic(() => import('./Leaderboard.js'))
const LikeButton = dynamic(() => import('./LikeButton.js'))
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

  const { data: mapData, error: mErr } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/maps/${params.id}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())

  if (!mapData || mErr) notFound()

  const { data: creator } = await fetch(
    `${process.env.NEXT_PUBLIC_URL}/api/users/${mapData.creator}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  ).then((res) => res.json())
  const { data: liked } = await hasLiked(mapData.id)

  const session = await auth()

  const { t } = await createTranslation(['common', 'map'])

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
          <p>{t(`map_type.${mapData.type}`)}</p>
          <p>{mapData.description}</p>
          {creator?.is_public && (
            <div>
              <span>
                Created by{' '}
                <Link href={`/user/${mapData.creator}`}>
                  {creator.display_name}
                </Link>
              </span>
            </div>
          )}
          <p>
            {t('updated', {
              val: new Date(mapData.updated_at),
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
              <div>{mapData.average_score.toLocaleString()}</div>
              <div>{t('map:avg_score')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <UsersRound size={24} />
            <div>
              <div>{mapData.explorers.toLocaleString()}</div>
              <div>{t('map:explorers')}</div>
            </div>
          </div>
          <div className={styles.card}>
            <Earth size={24} />
            <div>
              <div>{mapData.locations_count.toLocaleString()}</div>
              <div>
                {t('map:locations', {
                  count: mapData.locations_count,
                })}
              </div>
            </div>
          </div>
          <div className={styles.card}>
            <LikeButton defaultLiked={liked} mapId={mapData.id} />
            <div>
              <div>{mapData.likes_count.toLocaleString()}</div>
              <div>{t('map:likes')}</div>
            </div>
          </div>
        </div>
        <div>
          <PlayButton mapData={mapData} userId={session?.user.id} />
          {mapData.creator === session?.user.id && (
            <EditButton mapId={mapData.id} />
          )}
        </div>
      </section>
      <section>
        <h2>{t('map:leaderboard')}</h2>
        <Leaderboard mapId={mapData.id} />
      </section>
    </>
  )
}

export default Map
