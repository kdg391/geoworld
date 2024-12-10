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

export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S

export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S

const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/gi, (group) =>
    group.toUpperCase().replace(/[-_]/g, ''),
  )

const camelToSnake = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase()

// https://stackoverflow.com/a/75927783
export const snakeCaseToCamelCase = <T>(item: unknown): T => {
  if (Array.isArray(item)) {
    return item.map((el) => snakeCaseToCamelCase(el)) as T
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item as T
  }

  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(
      ([key, value]: [string, unknown]) => [
        snakeToCamel(key),
        snakeCaseToCamelCase(value),
      ],
    ),
  ) as T
}

export const camelCaseToSnakeCase = <T>(item: unknown): T => {
  if (Array.isArray(item)) {
    return item.map((el) => camelCaseToSnakeCase(el)) as T
  } else if (typeof item === 'function' || item !== Object(item)) {
    return item as T
  }

  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(([key, value]) => [
      camelToSnake(key),
      camelCaseToSnakeCase(value),
    ]),
  ) as T
}
