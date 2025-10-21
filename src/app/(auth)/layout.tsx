import dynamic from 'next/dynamic'

import styles from './layout.module.css'

import './layout.css'

const Footer = dynamic(() => import('../(ui)/Footer.tsx'))
const Header = dynamic(() => import('@/components/Header/index.tsx'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main className={styles.main}>
        <section className={styles.section}>{children}</section>
      </main>

      <Footer />
    </>
  )
}
