import process from 'node:process'
import { fileURLToPath } from 'node:url'

import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

const __filename = fileURLToPath(import.meta.url)

if (__filename === process.argv[1]) {
  config({ path: '.env.local' })
}

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_URL as string,
  },
  migrations: {
    schema: 'public',
  },
})
