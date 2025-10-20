'use client'

import dynamic from 'next/dynamic'

import styles from './Footer.module.css'

const ThemeSelect = dynamic(
  () => import('@/components/ThemeSelect/index.tsx'),
  { ssr: false },
)

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <ThemeSelect />
    </footer>
  )
}

export default Footer
