import dynamic from 'next/dynamic'

import styles from './layout.module.css'

const Aside = dynamic(() => import('./Aside.js'))
const Header = dynamic(() => import('@/components/Header/index.js'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <Aside />

        {children}
      </main>
    </>
  )
}
