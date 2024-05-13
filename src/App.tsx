import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Home from './routes/Home.js'
import LocationPicker from './routes/LocationPicker.js'
import Game from './routes/Game.js'
import RandomStreetView from './routes/RandomStreetView.js'
import NotFound from './routes/NotFound.js'

const router = createBrowserRouter([
    {
        path: '/geography-guessing/',
        element: <Home />,
    },
    {
        path: '/geography-guessing/game/:code',
        element: <Game />,
    },
    {
        path: '/geography-guessing/location-picker',
        element: <LocationPicker />,
    },
    {
        path: '/geography-guessing/random-streetview',
        element: <RandomStreetView />,
    },
    {
        path: '/geography-guessing/*',
        element: <NotFound />,
    },
])

const App = () => <RouterProvider router={router} />

export default App
