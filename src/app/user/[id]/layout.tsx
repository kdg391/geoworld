import dynamic from 'next/dynamic'

import type { Metadata } from 'next'

const Header = dynamic(() => import('../../../components/Header/index.js'))

export const metadata: Metadata = {
  title: 'User - GeoWorld',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main>{children}</main>
    </>
  )
}
