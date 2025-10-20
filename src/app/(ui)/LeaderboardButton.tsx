'use client'

import { Trophy } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/common/Button/index.tsx'

import Leaderboard from './Leaderboard.tsx'

import styles from './LeaderboardButton.module.css'

import './LeaderboardButton.css'

const LeaderboardButton = () => {
  const modalRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  const handleOutsideClick = (event: MouseEvent) => {
    if (isOpen) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as HTMLElement)
      )
        setIsOpen(false)
    }
  }

  useEffect(() => {
    window.addEventListener('click', handleOutsideClick)

    return () => {
      window.removeEventListener('click', handleOutsideClick)
    }
  }, [isOpen])

  return (
    <div ref={modalRef}>
      <Button
        variant={isOpen ? 'gray' : 'primary'}
        size="m"
        className={styles.button}
        onClick={() => setIsOpen((o) => !o)}
      >
        <Trophy size={16} fill="#fff" stroke="#fff" />
        랭킹 {isOpen ? '닫기' : '보기'}
      </Button>

      <div
        className={styles['leaderboard-container']}
        style={{
          display: isOpen ? 'flex' : 'none',
        }}
      >
        <Leaderboard />
      </div>
    </div>
  )
}

export default LeaderboardButton
