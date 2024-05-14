import { Link } from 'react-router-dom'

import styles from './NotFound.module.css'

const NotFound = () => (
    <main className={styles.main}>
        <h1>404 Not Found</h1>
        <div>
            <Link to="/geography-guessing/" className={styles.backToHome}>
                Back to Home
            </Link>
        </div>
    </main>
)

export default NotFound
