import Image from 'next/image'
import Link from 'next/link'

import styles from './index.module.css'

const AuthHeader = () => (
  <header className={styles.header}>
    <Link href="/" className={styles['title-link']}>
      <Image
        src="/assets/light.svg"
        width={124}
        height={24}
        alt="GeoWorld Logo"
        className="dark-hidden"
      />
      <Image
        src="/assets/dark.svg"
        width={124}
        height={24}
        alt="GeoWorld Logo"
        className="light-hidden"
      />
    </Link>
  </header>
)

export default AuthHeader
