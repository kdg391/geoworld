import Image from 'next/image'
import Link from 'next/link'

import styles from './index.module.css'

const AuthHeader = () => (
  <header className={styles.header}>
    <h2 className={styles.title}>
      <Link href="/" className={styles['title-link']}>
        <Image src="/assets/icons/icon.svg" alt="Icon" width={18} height={18} />
        <span>GeoWorld</span>
      </Link>
    </h2>
  </header>
)

export default AuthHeader
