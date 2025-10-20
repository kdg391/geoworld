export type SnakeToCamelCase<S extends string> =
  S extends `${infer T}_${infer U}`
    ? `${T}${Capitalize<SnakeToCamelCase<U>>}`
    : S

export type CamelToSnakeCase<S extends string> =
  S extends `${infer T}${infer U}`
    ? `${T extends Capitalize<T> ? '_' : ''}${Lowercase<T>}${CamelToSnakeCase<U>}`
    : S

export const snakeToCamel = (str: string): string =>
  str.replace(/([-_][a-z])/gi, (group) =>
    group.toUpperCase().replace(/[-_]/g, ''),
  )

export const camelToSnake = (str: string): string =>
  str.replace(/([A-Z])/g, '_$1').toLowerCase()

export const snakeCaseToCamelCase = <T>(item: unknown): T => {
  if (Array.isArray(item))
    return item.map((el) => snakeCaseToCamelCase(el)) as T

  if (
    item instanceof Date ||
    typeof item === 'function' ||
    item !== Object(item)
  )
    return item as T

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
  if (Array.isArray(item))
    return item.map((el) => camelCaseToSnakeCase(el)) as T

  if (
    item instanceof Date ||
    typeof item === 'function' ||
    item !== Object(item)
  )
    return item as T

  return Object.fromEntries(
    Object.entries(item as Record<string, unknown>).map(([key, value]) => [
      camelToSnake(key),
      camelCaseToSnakeCase(value),
    ]),
  ) as T
}
