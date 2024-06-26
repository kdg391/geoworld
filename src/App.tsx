import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import GoogleApiProvider from './providers/GoogleApiProvider.js'
import SettingsProvider from './providers/SettingsProvider.js'
import ThemeProvider from './providers/ThemeProvider.js'

import './i18n.js'

const ErrorPage = lazy(() => import('./components/ErrorPage.js'))

const About = lazy(() => import('./routes/About.js'))
const Game = lazy(() => import('./routes/Game.js'))
const Home = lazy(() => import('./routes/Home.js'))
const LocationPicker = lazy(() => import('./routes/LocationPicker.js'))
const NotFound = lazy(() => import('./routes/NotFound.js'))
const RandomStreetView = lazy(() => import('./routes/RandomStreetView.js'))

const router = createBrowserRouter([
    {
        path: '/geoworld/',
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geoworld/game/:code',
        element: <Game />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geoworld/location-picker',
        element: <LocationPicker />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geoworld/random-streetview',
        element: <RandomStreetView />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geoworld/about',
        element: <About />,
        errorElement: <ErrorPage />,
    },
    {
        path: '/geoworld/*',
        element: <NotFound />,
    },
])

const App = () => (
    <ThemeProvider>
        <SettingsProvider>
            <GoogleApiProvider>
                <Suspense>
                    <RouterProvider router={router} />
                </Suspense>
            </GoogleApiProvider>
        </SettingsProvider>
    </ThemeProvider>
)

export default App
