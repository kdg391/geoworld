import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Map - GeoWorld',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
