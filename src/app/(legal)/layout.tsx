import dynamic from 'next/dynamic'

const Header = dynamic(() => import('../../components/Header/index.js'))

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />

      <main>{children}</main>
    </>
  )
}
