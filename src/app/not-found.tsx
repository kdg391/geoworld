import Link from 'next/link'

import styles from './not-found.module.css'

const NotFound = () => {
  return (
    <main className={styles.main}>
      <h1 className={styles.title}>404 Not Found</h1>
      <p>
        <Link href="/">Back to Home</Link>
      </p>
    </main>
  )
}

export default NotFound
