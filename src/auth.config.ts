import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import Discord, { type DiscordProfile } from 'next-auth/providers/discord'

import { createTranslation } from './i18n/server.js'

import { createClient } from './utils/supabase/server.js'

import { signInCredentialsSchema } from './utils/validations/auth.js'

import 'server-only'

import type { NextAuthConfig } from 'next-auth'
import type { User } from './types/index.js'

class CredentialsError extends Error {
  name = 'CredentialsError'
}

export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: { label: 'email', type: 'text' },
        password: { label: 'password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } =
          await signInCredentialsSchema.parseAsync(credentials)

        const supabase = createClient({
          serviceRole: true,
        })

        // logic to verify if the user exists
        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single<User>()

        const { t } = await createTranslation('auth')

        if (!user) {
          // No user found, so this is their first attempt to login
          // meaning this is also the place you could do registration
          throw new CredentialsError(t('invalid_credentials'))
        }

        const isPwMatched = await bcrypt.compare(
          password,
          user.hashed_password as string,
        )

        if (!isPwMatched) {
          throw new CredentialsError(t('invalid_credentials'))
        }

        return {
          id: user.id,
          created_at: user.created_at,
          email: user.email,
          emailVerified: user.emailVerified,
          role: user.role,
        }
      },
    }),
    Discord({
      profile(profile: DiscordProfile) {
        return {
          id: profile.id,
          email: profile.email,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
