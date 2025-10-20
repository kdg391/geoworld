import { customType } from 'drizzle-orm/pg-core'

import { camelCaseToSnakeCase, snakeCaseToCamelCase } from '@/utils/casing.ts'

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return (
    v !== null &&
    typeof v === 'object' &&
    Object.getPrototypeOf(v) === Object.prototype
  )
}

const ISO_REG = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/

function dateToISODeep(v: unknown): unknown {
  if (v instanceof Date) return v.toISOString()
  if (Array.isArray(v)) return v.map(dateToISODeep)

  if (isPlainObject(v)) {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, dateToISODeep(x)]),
    )
  }

  return v
}

function reviveDateDeep(v: unknown): unknown {
  if (typeof v === 'string' && ISO_REG.test(v)) return new Date(v)
  if (Array.isArray(v)) return v.map(reviveDateDeep)

  if (isPlainObject(v)) {
    return Object.fromEntries(
      Object.entries(v).map(([k, x]) => [k, reviveDateDeep(x)]),
    )
  }

  return v
}

export const customJsonb = <T>(name: string) =>
  customType<{
    data: T
    driverData: string
  }>({
    dataType() {
      return 'jsonb'
    },
    toDriver(value: T): string {
      return JSON.stringify(dateToISODeep(camelCaseToSnakeCase(value)))
    },
    fromDriver(value: unknown): T {
      const parsed = typeof value === 'string' ? JSON.parse(value) : value

      return snakeCaseToCamelCase(reviveDateDeep(parsed)) as T
    },
  })(name)
