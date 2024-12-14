'use server'

import { hash, verify } from '@node-rs/argon2'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { passwordOptions } from '@/password.js'
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from '@/session.js'

import { createClient } from '@/utils/supabase/server.js'
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '@/utils/validations/auth.js'

import type { APIAccount } from '@/types/account.js'

export const changeEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your email.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  if (user.emailVerified) {
    const emailConfirmedAt = user.emailVerifiedAt.getTime()

    if (Date.now() - emailConfirmedAt < 60 * 60 * 24 * 7 * 1000)
      return {
        errors: {
          message: 'The email can be changed one week after the last change.',
        },
      }
  }

  const validated = await changeEmailSchema.safeParseAsync({
    oldEmail: user.email,
    newEmail: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: emailExists, error: eErr } = await supabase
    .rpc('check_email_exists', {
      p_email: validated.data.newEmail,
    })
    .returns<boolean>()

  if (eErr)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  if (emailExists)
    return {
      errors: {
        message: 'The email is already registered.',
      },
    }

  const { error } = await supabase
    .from('users')
    .update({
      email: validated.data.newEmail,
      emailVerified: null,
    })
    .eq('id', user.id)

  if (error)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  return {
    errors: null,
  }
}

export const changePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your password.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const validated = await changePasswordSchema.safeParseAsync({
    oldPassword: formData.get('old-password'),
    newPassword: formData.get('new-password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data: account } = await supabase
    .from('accounts')
    .select('*')
    .match({
      provider: 'credentials',
      user_id: user.id,
    })
    .single<APIAccount>()

  if (account === null)
    return {
      errors: {
        message: 'Failed to load your data.',
      },
    }

  const isPwMatched = await verify(
    account.hashed_password as string,
    validated.data.oldPassword,
    passwordOptions,
  )

  if (!isPwMatched)
    return {
      errors: {
        oldPassword: ['The old password is not matched.'],
      },
    }

  const hashedPassword = await hash(validated.data.newPassword, passwordOptions)

  const { error: updatedErr } = await supabase
    .from('accounts')
    .update<Partial<APIAccount>>({
      hashed_password: hashedPassword,
    })
    .match({
      provider: 'credentials',
      user_id: user.id,
    })

  if (updatedErr)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  return {
    errors: null,
  }
}

export const deleteAccount = async (_: unknown, formData: FormData) => {
  'use server'

  const { session, user } = await getCurrentSession()

  if (!session) redirect('/sign-in')

  if (user.role !== 'user')
    return {
      errors: {
        message: 'You cannot delete your account.',
      },
    }

  const validated = await deleteAccountSchema.safeParseAsync({
    password: formData.get('password'),
    confirmMessage: formData.get('confirm-message'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient({
    serviceRole: true,
  })

  const { error } = await supabase.from('users').delete().eq('id', user.id)

  if (error)
    return {
      errors: {
        message: 'Something went wrong!',
      },
    }

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()

  revalidatePath('/', 'layout')
  redirect('/')
}
