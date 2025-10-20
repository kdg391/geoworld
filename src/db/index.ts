import 'server-only'

import { drizzle } from 'drizzle-orm/node-postgres'

export const db = drizzle({
  connection: {
    connectionString: process.env.POSTGRES_URL as string,
    // ssl: true,
  },
})
