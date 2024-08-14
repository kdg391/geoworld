import dynamic from 'next/dynamic'

const Aside = dynamic(() => import('./Aside.js'))
const Header = dynamic(() => import('@/components/Header/index.js'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main>
        <Aside />

        {children}
      </main>
    </>
  )
}
