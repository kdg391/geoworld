import dynamic from 'next/dynamic'

import styles from './layout.module.css'

const Aside = dynamic(() => import('./Aside.js'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className={styles.main}>
      <Aside />

      {children}
    </main>
  )
}
