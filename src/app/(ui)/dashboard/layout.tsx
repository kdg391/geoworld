import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Dashboard - GeoWorld',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
