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

// https://stackoverflow.com/a/12646864
export const shuffleArray = <T>(arr: T[]) => {
  const newArr = [...arr]

  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[newArr[i], newArr[j]] = [newArr[j], newArr[i]]
  }

  return newArr
}
