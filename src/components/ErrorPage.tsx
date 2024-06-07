import { useTranslation } from 'react-i18next'
import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()
    const { t } = useTranslation()

    if (error instanceof Error)
        return (
            <div>
                <h1>{t('error.title')}</h1>
                <p>{error.message}</p>
            </div>
        )

    return <></>
}

export default ErrorPage
