export const classNames = (...args: string[]) =>
  args.filter((c) => c !== '').join(' ')

export const toCodePoint = (str: string) => {
  const r = []

  for (const s of str) {
    const c = s.codePointAt(0) as number

    r.push(c.toString(16))
  }

  return r.join('-')
}

export const formatTimeLeft = (timeLeft: number) => {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const secs = String(timeLeft % 60).padStart(2, '0')

  return `${mins}:${secs}`
}

export const formatRankTime = (seconds: number) => {
  const hour = Math.floor(seconds / 3600)
  const min = Math.floor((seconds % 3600) / 60)
  const sec = seconds % 60

  const arr = []

  if (hour !== 0) arr.push(`${hour}시간`)
  if (min !== 0) arr.push(`${min}분`)

  arr.push(`${sec}초`)

  return arr.join(' ')
}
