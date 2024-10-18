'use server'

import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { AuthError } from 'next-auth'

import { auth, signIn, signOut } from '../auth.js'

import { createClient } from '../utils/supabase/server.js'
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
  resetPasswordSchema,
  signInCredentialsSchema,
  signInEmailSchema,
  signUpSchema,
  updatePasswordSchema,
} from '../utils/validations/auth.js'

import type { User } from '@/types/index.js'

export const signUpCredentials = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signUpSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient({
    serviceRole: true,
  })

  const { data: emailExists, error: emailErr } = await supabase
    .rpc('check_email_exists', {
      p_email: validated.data.email,
    })
    .returns<boolean>()

  if (emailExists)
    return {
      errors: {
        email: ['The email already exists.'],
      },
    }

  if (emailErr)
    return {
      errors: {
        email: [emailErr.message],
      },
    }

  const hashedPassword = await bcrypt.hash(validated.data.password, 10)

  const { data: user, error: userErr } = await supabase
    .from('users')
    .insert({
      email: validated.data.email,
      emailVerified: null,
      hashed_password: hashedPassword,
    })
    .select()
    .single()

  if (userErr)
    return {
      errors: {
        message: userErr.message,
      },
    }

  const { error: profileErr } = await supabase.from('profiles').insert({
    id: user.id,
    is_public: true,
  })

  if (profileErr)
    return {
      errors: {
        message: profileErr.message,
      },
    }

  const { error: accountErr } = await supabase.from('accounts').insert({
    provider: 'credentials',
    providerAccountId: user.id,
    type: 'credentials',
    userId: user.id,
  })

  if (accountErr)
    return {
      errors: {
        message: accountErr.message,
      },
    }

  revalidatePath('/sign-in', 'layout')

  return redirect('/sign-in')
}

export const signInCredentials = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInCredentialsSchema.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  let redirectTo = '/dashboard'
  const referrer = headers().get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirectTo = next
  }

  try {
    await signIn('credentials', {
      email: validated.data.email,
      password: validated.data.password,
      redirectTo,
    })
  } catch (err) {
    if (err instanceof AuthError) {
      switch (err.type) {
        case 'CredentialsSignin':
          return {
            errors: {
              message: 'Email or password is incorrect.',
            },
          }
        default:
          return {
            errors: {
              message: 'Something went wrong!',
            },
          }
      }
    }

    throw err
  }

  return {
    errors: null,
  }
}

export const signInEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInEmailSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  let redirectTo = '/dashboard'
  const referrer = headers().get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirectTo = next
  }

  try {
    await signIn('resend', {
      email: validated.data.email,
      redirectTo,
    })
  } catch (err) {
    if (err instanceof AuthError)
      return {
        errors: {
          message: 'Something went wrong!',
        },
      }

    throw err
  }

  return {
    errors: null,
  }
}

export const signInDiscord = async (_: unknown) => {
  'use server'

  let redirectTo = '/dashboard'
  const referrer = headers().get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirectTo = next
  }

  try {
    await signIn('discord', {
      redirectTo,
    })
  } catch (err) {
    if (err instanceof AuthError) return /*{
        errors: {
          message: 'Something went wrong!',
        },
      }*/

    throw err
  }

  return /*{
    errors: null,
  }*/
}

export const resetPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await resetPasswordSchema.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/reset-password`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: validated.data.email,
        }),
      },
    )

    const data = await response.json()
    console.log(data)
  } catch (err) {
    if (err instanceof Error)
      return {
        errors: {
          message: err.message,
        },
      }

    return {
      errors: null,
    }
  }

  redirect('/email-has-sent')
}

export const updatePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await updatePasswordSchema.safeParseAsync({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_URL}/api/auth/update-password`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: formData.get('token'),
          password: validated.data.password,
        }),
      },
    )

    const data = await response.json()
    console.log(data)
  } catch (err) {
    console.log(err)

    if (err instanceof Error)
      return {
        errors: {
          message: err.message,
        },
      }

    return
  }

  redirect('/sign-in')
}

export const changeEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'user')
    return {
      errors: {
        message: 'You cannot change your email.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  if (session.user.emailVerified) {
    const emailConfirmedAt = new Date(session.user.emailVerified).getTime()

    if (Date.now() - emailConfirmedAt < 60 * 60 * 24 * 7 * 1000)
      return {
        errors: {
          message: 'The email can be changed one week after the last change.',
        },
      }
  }

  const validated = await changeEmailSchema.safeParseAsync({
    oldEmail: session.user.email,
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
        message: eErr.message,
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
    .eq('id', session.user.id)

  return {
    errors: {
      message: error?.message,
    },
  }
}

export const changePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'user')
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

  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.user.id)
    .single<User>()

  if (!data || error)
    return {
      errors: {
        message: 'Failed to load your data.',
      },
    }

  const isPwMatched = await bcrypt.compare(
    validated.data.oldPassword,
    data.hashed_password as string,
  )

  if (!isPwMatched)
    return {
      errors: {
        oldPassword: ['The old password is not matched.'],
      },
    }

  const hashedPassword = await bcrypt.hash(validated.data.newPassword, 10)

  const { error: updatedErr } = await supabase
    .from('users')
    .update({
      hashed_password: hashedPassword,
    })
    .eq('id', session.user.id)

  return {
    errors: {
      message: updatedErr?.message,
    },
  }
}

export const deleteAccount = async (_: unknown, formData: FormData) => {
  'use server'

  const session = await auth()

  if (!session) redirect('/sign-in')

  if (session.user.role !== 'user')
    return {
      errors: {
        message: 'You cannot delete your account.',
      },
    }

  const supabase = createClient({
    supabaseAccessToken: session.supabaseAccessToken,
  })

  const validated = await deleteAccountSchema.safeParseAsync({
    password: formData.get('password'),
    confirmMessage: formData.get('confirm-message'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  await signOut()

  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', session.user.id)

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  revalidatePath('/', 'layout')
  redirect('/')
}
