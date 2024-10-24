import bcrypt from 'bcryptjs'
import Credentials from 'next-auth/providers/credentials'
import Discord, { type DiscordProfile } from 'next-auth/providers/discord'

import { createClient } from './utils/supabase/server.js'
import { signInCredentialsSchema } from './utils/validations/auth.js'

import type { NextAuthConfig } from 'next-auth'
import type { User } from './types/index.js'

export default {
  providers: [
    Credentials({
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

        const { data: user } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single<User>()

        if (!user) return null

        const isPwMatched = await bcrypt.compare(
          password,
          user.hashed_password as string,
        )

        if (!isPwMatched) return null

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
      authorization: 'https://discord.com/api/oauth2/authorize?scope=email',
      profile(profile: DiscordProfile) {
        return {
          email: profile.email,
        }
      },
    }),
  ],
} satisfies NextAuthConfig
