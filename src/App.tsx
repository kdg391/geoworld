import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import ErrorPage from './components/ErrorPage.js'

import ThemeProvider from './providers/ThemeProvider.js'

import Game from './routes/Game.js'
import Home from './routes/Home.js'
import LocationPicker from './routes/LocationPicker.js'
import NotFound from './routes/NotFound.js'
import RandomStreetView from './routes/RandomStreetView.js'
import SettingsProvider from './providers/SettingsProvider.js'

import './i18n.js'

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
            <RouterProvider router={router} />
        </SettingsProvider>
    </ThemeProvider>
)

export default App
