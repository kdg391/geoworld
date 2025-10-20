import dynamic from 'next/dynamic'

import styles from './layout.module.css'

import './layout.css'

const AuthFooter = dynamic(() => import('@/components/AuthFooter/index.tsx'))
const AuthHeader = dynamic(() => import('@/components/AuthHeader/index.tsx'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthHeader />

      <main className={styles.main}>
        <section className={styles.section}>{children}</section>
      </main>

      <AuthFooter />
    </>
  )
}
