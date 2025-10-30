'use client'

import { Trophy, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/common/Button/index.tsx'

import Leaderboard from './Leaderboard.tsx'

import styles from './LeaderboardButton.module.css'

import './LeaderboardButton.css'

const LeaderboardButton = () => {
  const modalRef = useRef<HTMLDivElement>(null)

  const [isOpen, setIsOpen] = useState(false)

  /*const handleOutsideClick = (event: MouseEvent) => {
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

    return () => window.removeEventListener('click', handleOutsideClick)
  }, [isOpen])*/

  useEffect(() => {
    const onKeydown = (event: KeyboardEvent) => {
      if (
        event.key === 'F12' ||
        ((event.ctrlKey || event.metaKey) &&
          event.shiftKey &&
          (event.key.toLowerCase() === 'i' || event.key.toLowerCase() === 'j'))
      ) {
        event.preventDefault()

        return false
      }
    }

    document.addEventListener('keydown', onKeydown)

    return () => document.removeEventListener('keydown', onKeydown)
  }, [])

  return (
    <div ref={modalRef}>
      <Button
        variant={isOpen ? 'gray' : 'primary'}
        size="m"
        className={styles.button}
        onClick={() => setIsOpen((o) => !o)}
      >
        {isOpen ? (
          <X size={16} fill="#fff" stroke="#fff" />
        ) : (
          <Trophy size={16} fill="#fff" stroke="#fff" />
        )}
        랭킹 {isOpen ? '닫기' : '보기'}
      </Button>

      <Leaderboard isOpen={isOpen} />
    </div>
  )
}

export default LeaderboardButton
