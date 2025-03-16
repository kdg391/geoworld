import Link from 'next/link'

interface Props {
  title?: string
}

const NotFound = async ({ title }: Props) => {
  return (
    <div>
      <h1>{title ?? 'Not Found'}</h1>
      <Link href="/">Back to Home</Link>
    </div>
  )
}

export default NotFound
