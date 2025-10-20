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

const unitsInSec = [
  60,
  60 * 60,
  60 * 60 * 24,
  60 * 60 * 24 * 7,
  60 * 60 * 24 * 30,
  60 * 60 * 24 * 365,
  Infinity,
]

const unitStrings = [
  'second',
  'minute',
  'hour',
  'day',
  'week',
  'month',
  'year',
] as const

export const formatRelativeTime = (
  date: Date,
  locales?: Intl.LocalesArgument,
) => {
  const secondsDiff = Math.round((date.getTime() - Date.now()) / 1000)

  const unitIndex = unitsInSec.findIndex(
    (cutoff) => cutoff > Math.abs(secondsDiff),
  )

  const divisor = unitIndex ? unitsInSec[unitIndex - 1] : 1

  const formatter = new Intl.RelativeTimeFormat(locales ?? 'en', {
    numeric: 'auto',
  })

  const relativeTime = formatter.format(
    Math.floor(secondsDiff / divisor),
    unitStrings[unitIndex],
  )

  return relativeTime
}
