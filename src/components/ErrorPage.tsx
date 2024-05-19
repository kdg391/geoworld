import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()

    if (error instanceof Error) {
        return <>An unknown has occurred. {error.message}</>
    }

    return <></>
}

export default ErrorPage
