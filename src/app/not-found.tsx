import Link from 'next/link'

const NotFound = () => {
  return (
    <main>
      <section>
        <h1>404 Not Found</h1>
        <Link href="/">Back to Home</Link>
      </section>
    </main>
  )
}

export default NotFound
