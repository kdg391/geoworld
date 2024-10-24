import { SupabaseAdapter } from '@auth/supabase-adapter'
import jwt from 'jsonwebtoken'
import NextAuth from 'next-auth'
import Resend from 'next-auth/providers/resend'

import authConfig from './auth.config.js'

import { signInHtml, signInText } from './utils/email.js'
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
          html: await signInHtml({ url, host, theme }),
          text: await signInText({ url, host }),
        }),
      })

      if (!res.ok)
        throw new Error('Resend error: ' + JSON.stringify(await res.json()))
    },
  }),
]

export const {
  handlers,
  signIn,
  signOut,
  auth,
  unstable_update: update,
} = NextAuth(() => {
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
        // console.log(
        //   'jwt({ account, profile, token, user })',
        //   account,
        //   profile,
        //   token,
        //   user,
        // )

        if (user) {
          // eslint-disable-next-line
          // @ts-ignore
          token.user = user
        }

        return token
      },
      async session({ session, token }) {
        // console.log('session({ session, token })', session, token)

        // eslint-disable-next-line
        // @ts-ignore
        session.user = token.user

        const payload = {
          aud: 'authenticated',
          exp: Math.floor(new Date(session.expires).getTime() / 1000),
          // eslint-disable-next-line
          // @ts-ignore
          sub: token.user.id,
          // eslint-disable-next-line
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
      async signIn({ account }) {
        if (account?.provider !== 'credentials') return true

        return true
      },
    },
    providers,
    trustHost: true,
    events: {
      async linkAccount({ user }) {
        await supabase
          .from('users')
          .update({
            emailVerified: new Date().toISOString(),
          })
          .eq('id', user.id)
      },
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
    },
  }
})
