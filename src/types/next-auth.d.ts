import type { DefaultSession } from 'next-auth'
import type { DefaultUser } from './index.js'

declare module 'next-auth' {
  // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
  interface Session {
    // A JWT which can be used as Authorization header with supabase-js for RLS.
    supabaseAccessToken?: string
    user: DefaultSession['user'] & DefaultUser
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends DefaultJWT {
    user: DefaultUser
  }
}

declare module '@auth/core/jwt' {
  interface JWT extends DefaultJWT {
    user: DefaultUser
  }
}
