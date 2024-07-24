import Link from 'next/link'

import styles from './index.module.css'
import './index.css'

const AuthFooter = () => (
  <footer className={styles.footer}>
    <div>GeoWorld</div>
    <nav>
      <ul className={styles.links}>
        <li>
          <Link href="/terms-of-service">Terms</Link>
        </li>
        <li>
          <Link href="/privacy-policy">Privacy</Link>
        </li>
      </ul>
    </nav>
  </footer>
)

export default AuthFooter
