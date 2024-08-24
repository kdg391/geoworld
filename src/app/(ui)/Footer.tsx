'use client'

import dynamic from 'next/dynamic'
import { usePathname } from 'next/navigation'

const HomeFooter = dynamic(() => import('@/components/HomeFooter/index.js'))

const Footer = () => {
  const pathname = usePathname()

  return pathname === '/' || pathname === '/home' ? <HomeFooter /> : null
}

export default Footer
