import Header from '@/components/Header/index.tsx'

import Footer from './Footer.tsx'

import styles from './layout.module.css'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <div className={styles['main-container']}>{children}</div>

      <Footer />
    </>
  )
}
