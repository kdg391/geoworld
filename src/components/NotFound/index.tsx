import Link from 'next/link'

const NotFound = async () => {
  return (
    <div>
      <h1>Map Not Found</h1>
      <Link href="/">Back to Home</Link>
    </div>
  )
}

export default NotFound
