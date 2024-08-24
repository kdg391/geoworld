'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

import { addLike, deleteLike } from '@/actions/map.js'

import { classNames } from '@/utils/index.js'

import styles from './LikeButton.module.css'

interface Props {
  defaultLiked: boolean
  mapId: string
}

const LikeButton = ({ defaultLiked, mapId }: Props) => {
  const [liked, setLiked] = useState(defaultLiked)

  return (
    <button
      className={classNames(styles['like-btn'], liked ? 'like' : '')}
      onClick={async () => {
        if (liked) {
          await deleteLike(mapId)
          setLiked(false)
        } else {
          await addLike(mapId)
          setLiked(true)
        }
      }}
    >
      <Heart size={24} />
    </button>
  )
}

export default LikeButton
