import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import styles from './NotFound.module.css'

const NotFound = () => {
    const { t } = useTranslation()

    return (
        <main className={styles.main}>
            <h1>404 Not Found</h1>
            <div>
                <Link to="/geography-guessing/" className={styles.backToHome}>
                    {t('notFound.backToHome')}
                </Link>
            </div>
        </main>
    )
}

export default NotFound
