import { SupabaseAdapter } from '@auth/supabase-adapter'
import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'

import authConfig from './auth.config.js'

import { html, text } from './utils/email.js'

import { createClient } from './utils/supabase/server.js'

const supabase = createClient({
  serviceRole: true,
})

const providers = [
  ...authConfig.providers,
  Resend({
    apiKey: process.env.AUTH_RESEND_KEY,
    from: process.env.RESEND_EMAIL_FROM,
    async sendVerificationRequest({ identifier: to, provider, url, theme }) {
      const { host } = new URL(url)

      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${provider.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: `GeoWorld <${provider.from}>`,
          to,
          subject: `Sign in to ${host}`,
          html: await html({ url, host, theme }),
          text: await text({ url, host }),
        }),
      })

      if (!res.ok)
        throw new Error('Resend error: ' + JSON.stringify(await res.json()))
    },
  }),
]

export const { handlers, signIn, signOut, auth } = NextAuth(() => {
  const adapter = SupabaseAdapter({
    url: process.env.SUPABASE_URL as string,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  })

  return {
    adapter,
    pages: {
      signIn: '/sign-in',
      newUser: '/sign-up',
    },
    session: {
      strategy: 'jwt',
      maxAge: 60 * 60 * 24 * 30,
    },
    jwt: {
      maxAge: 60 * 60 * 24 * 30,
    },
    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.user = user
        }

        return token
      },
      session({ session, token }) {
        // @ts-ignore
        session.user = token.user

        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          // @ts-ignore
          sub: token.user.id,
          // @ts-ignore
          email: token.user.email,
          role: 'authenticated',
        }

        session.supabaseAccessToken = jwt.sign(
          payload,
          process.env.SUPABASE_JWT_SECRET as string,
        )

        return session
      },
    },
    providers,
    trustHost: true,
    events: {
      async signIn({ account, user, isNewUser }) {
        if (
          (account?.provider === 'resend' || account?.provider === 'discord') &&
          isNewUser
        ) {
          await supabase.from('profiles').insert({
            id: user.id,
            is_public: true,
          })
        }
      },
      async signOut(message) {
        if ('session' in message && message.session?.sessionToken) {
          await supabase
            .from('sessions')
            .delete()
            .eq('sessionToken', message.session?.sessionToken)
        }
      },
    },
  }
})
