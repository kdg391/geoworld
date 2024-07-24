import localFont from 'next/font/local'

import { getLocale } from '../i18n/server.js'

import LocaleProvider from '../providers/LocaleProvider.js'
import SettingsProvider from '../providers/SettingsProvider.js'
import ThemeProvider from '../providers/ThemeProvider.js'

import './globals.css'

import type { Metadata } from 'next'

const pretendard = localFont({
  src: [
    {
      path: '../assets/fonts/Pretendard-Bold.subset.woff2',
      weight: '700',
    },
    {
      path: '../assets/fonts/Pretendard-SemiBold.subset.woff2',
      weight: '600',
    },
    {
      path: '../assets/fonts/Pretendard-Medium.subset.woff2',
      weight: '500',
    },
    {
      path: '../assets/fonts/Pretendard-Regular.subset.woff2',
      weight: '400',
    },
  ],
  variable: '--font',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: 'GeoWorld',
  description: 'GeoWorld is a geography guessing game.',
  openGraph: {
    type: 'website',
    siteName: 'GeoWorld',
  },
  icons: [
    {
      rel: 'shortcut icon',
      url: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-57x57.png',
      sizes: '57x57',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-60x60.png',
      sizes: '60x60',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-72x72.png',
      sizes: '72x72',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-76x76.png',
      sizes: '76x76',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-114x114.png',
      sizes: '114x114',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-120x120.png',
      sizes: '120x120',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-144x144.png',
      sizes: '144x144',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-152x152.png',
      sizes: '152x152',
    },
    {
      rel: 'apple-touch-icon',
      url: '/assets/icons/apple-icon-180x180.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      url: '/assets/icons/favicon-16x16.png',
      type: 'image/png',
      sizes: '16x16',
    },
    {
      rel: 'icon',
      url: '/assets/icons/favicon-32x32.png',
      type: 'image/png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      url: '/assets/icons/favicon-96x96.png',
      type: 'image/png',
      sizes: '96x96',
    },
    {
      rel: 'icon',
      url: '/assets/icons/favicon-192x192.png',
      type: 'image/png',
      sizes: '192x192',
    },
  ],
  manifest: '/manifest.json',
  robots: {
    index: false,
    follow: false,
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={pretendard.variable}>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(()=>{try{let theme=localStorage.getItem('theme')??'system';if(theme==='system'){const media=window.matchMedia('(prefers-color-scheme: light)');theme=media.matches?'light':'dark'}document.documentElement.setAttribute('data-theme',theme)}catch{}})()",
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if('serviceWorker' in navigator){window.addEventListener('load',()=>{navigator.serviceWorker.register('/service-worker.js').then(()=>console.log('ServiceWorker registration successful')).catch(()=>console.log('ServiceWorker registration failed'))})}",
          }}
        />

        <LocaleProvider value={locale}>
          <SettingsProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </SettingsProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
