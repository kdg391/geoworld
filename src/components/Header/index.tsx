'use server'

import Image from 'next/image'
import Link from 'next/link'

import styles from './Header.module.css'

import './Header.css'

const Header = async () => (
  <header className={styles.header}>
    <div>
      <Link href="/" scroll={false} className="flex">
        <Image
          src="/assets/light.svg"
          width={124}
          height={24}
          alt="GeoWorld Logo"
          className="dark-hidden"
          priority
        />
        <Image
          src="/assets/dark.svg"
          width={124}
          height={24}
          alt="GeoWorld Logo"
          className="light-hidden"
          priority
        />
      </Link>
    </div>
  </header>
)

export default Header
