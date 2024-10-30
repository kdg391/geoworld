'use client'

import { useState } from 'react'

import Leaderboard from './Leaderboard.js'

import Button from '@/components/common/Button/index.js'

import styles from './LeaderboardButton.module.css'
import { Trophy } from 'lucide-react'

const LeaderboardButton = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="primary"
        size="m"
        className={styles.button}
        onClick={() => setIsOpen((o) => !o)}
      >
        <Trophy size={16} fill="var(--color)" />
        랭킹 보기
      </Button>

      <div
        className={styles['leaderboard-container']}
        style={{
          display: isOpen ? 'flex' : 'none',
        }}
      >
        <Leaderboard />
      </div>
    </>
  )
}

export default LeaderboardButton
