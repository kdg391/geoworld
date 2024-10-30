'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <main>
          <section>
            <h2>문제가 발생했습니다.</h2>
            <p>{error.message}</p>
            <button onClick={() => reset()}>다시 시도하기</button>
          </section>
        </main>
      </body>
    </html>
  )
}
