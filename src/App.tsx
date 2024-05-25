import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import SettingsProvider from './providers/SettingsProvider.js'
import ThemeProvider from './providers/ThemeProvider.js'

import './i18n.js'

const ErrorPage = lazy(() => import('./components/ErrorPage.js'))

const Game = lazy(() => import('./routes/Game.js'))
const Home = lazy(() => import('./routes/Home.js'))
const LocationPicker = lazy(() => import('./routes/LocationPicker.js'))
const NotFound = lazy(() => import('./routes/NotFound.js'))
const RandomStreetView = lazy(() => import('./routes/RandomStreetView.js'))

const router = createBrowserRouter([
    {
        path: '/geography-guessing/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geography-guessing/game/:code',
        element: <Game />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geography-guessing/location-picker',
        element: <LocationPicker />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geography-guessing/random-streetview',
        element: <RandomStreetView />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geography-guessing/*',
        element: <NotFound />,
    },
])

const App = () => (
    <ThemeProvider>
        <SettingsProvider>
            <Suspense>
                <RouterProvider router={router} />
            </Suspense>
        </SettingsProvider>
    </ThemeProvider>
)

export default App
