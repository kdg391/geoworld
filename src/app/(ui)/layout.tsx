import dynamic from 'next/dynamic'

import Header from '@/components/Header/index.tsx'

import styles from './layout.module.css'

const Footer = dynamic(() => import('./Footer.tsx'))

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
