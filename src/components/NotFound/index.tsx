import Link from 'next/link'

const NotFound = async () => {
  return (
    <div>
      <h1>Map Not Found</h1>
      <Link href="/">홈으로 돌아가기</Link>
    </div>
  )
}

export default NotFound
