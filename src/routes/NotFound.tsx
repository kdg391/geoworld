import { Link } from 'react-router-dom'

import styles from './NotFound.module.css'
import { useTranslation } from 'react-i18next'

const NotFound = () => {
    const { t } = useTranslation('notFound')

    return (
        <main className={styles.main}>
            <h1>404 Not Found</h1>
            <div>
                <Link to="/geography-guessing/" className={styles.backToHome}>
                    {t('backToHome')}
                </Link>
            </div>
        </main>
    )
}

export default NotFound
