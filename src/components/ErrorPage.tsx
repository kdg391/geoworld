import { useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()

    if (error instanceof Error)
        return (
            <div>
                <h1>An unknown has occurred.</h1>
                <p>{error.message}</p>
            </div>
        )

    return <></>
}

export default ErrorPage
