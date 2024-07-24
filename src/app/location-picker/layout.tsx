import GoogleApiProvider from '../../providers/GoogleApiProvider.js'

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Location Picker - GeoWorld',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GoogleApiProvider>{children}</GoogleApiProvider>
}
