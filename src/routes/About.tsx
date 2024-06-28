import { Suspense, lazy } from 'react'

const Header = lazy(() => import('../components/Header.js'))

const About = () => (
    <main>
        <Suspense>
            <Header />
        </Suspense>
        <section>
            <h1>GeoWorld</h1>
        </section>
    </main>
)

export default About
