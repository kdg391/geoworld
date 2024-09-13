import dynamic from 'next/dynamic'

import styles from './layout.module.css'

import Header from '@/components/Header/index.js'

const Footer = dynamic(() => import('./Footer.js'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className={styles['main-container']}>
        {children}

        <Footer />
      </div>
    </>
  )
}
