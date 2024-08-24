import type { Metadata } from 'next'

export const generateMetadata = async (): Promise<Metadata> => {
  return {
    title: 'Daily Challenge - GeoWorld',
  }
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
