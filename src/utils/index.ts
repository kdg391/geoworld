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

export const randomLatLng = (): google.maps.LatLngLiteral => {
  const lat = Math.random() * 180 - 90
  const lng = Math.random() * 360 - 180

  return {
    lat,
    lng,
  }
}
