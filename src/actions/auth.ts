'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { ONE_DAY } from '../constants/index.js'

import { createClient } from '../utils/supabase/server.js'

import {
  changeEmailValidation,
  changePasswordValidation,
  deleteAccountValidation,
  resetPasswordValidation,
  signInValidation,
  signUpValidation,
  updatePasswordValidation,
} from '../utils/validations/auth.js'

export const signUp = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signUpValidation.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
    username: formData.get('username'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient(true)

  const { data: usernameExists, error: uNameErr } = await supabase
    .rpc('check_username_exists', {
      p_username: validated.data.username,
    })
    .returns<boolean>()

  if (usernameExists === true)
    return {
      errors: {
        username: ['The username already exists.'],
      },
    }

  if (uNameErr)
    return {
      errors: {
        username: [uNameErr.message],
      },
    }

  const { data: emailExists, error: eErr } = await supabase
    .rpc('check_email_exists', {
      p_email: validated.data.email,
    })
    .returns<boolean>()

  if (emailExists === true)
    return {
      errors: {
        email: ['The email already exists.'],
      },
    }

  if (eErr)
    return {
      errors: {
        email: [eErr.message],
      },
    }

  const { error } = await supabase.auth.admin.createUser({
    email: validated.data.email,
    password: validated.data.password,
    email_confirm: true,
    user_metadata: {
      display_name: validated.data.username,
      username: validated.data.username,
    },
  })

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  revalidatePath('/sign-in', 'layout')
  return redirect('/sign-in')
}

export const signIn = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await signInValidation.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email.trim(),
    password: validated.data.password,
  })

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  revalidatePath('/', 'layout')

  const referrer = headers().get('referer')

  if (referrer) {
    const next = new URL(referrer).searchParams.get('next')

    if (next) redirect(next)
  }

  redirect('/')
}

export const signOut = async () => {
  'use server'

  const supabase = createClient()

  await supabase.auth.signOut()
}

export const resetPassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await resetPasswordValidation.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const origin = headers().get('origin')

  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    validated.data.email,
    {
      redirectTo: `${origin}/update-password`,
    },
  )

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  return redirect('/')
}

export const updatePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const validated = await updatePasswordValidation.safeParseAsync({
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient()

  const { error: sErr } = await supabase.auth.exchangeCodeForSession(
    formData.get('code') as string,
  )

  if (sErr)
    return {
      errors: {
        message: sErr.message,
      },
    }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  })

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  redirect('/sign-in')
}

export const changeEmail = async (_: unknown, formData: FormData) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  if (!user.email)
    return {
      errors: {
        message: 'Cannot find your email.',
      },
    }

  if (user.email_confirmed_at) {
    const emailConfirmedAt = new Date(user.email_confirmed_at).getTime()

    if (Date.now() - emailConfirmedAt < ONE_DAY * 7 * 1000)
      return {
        errors: {
          message: 'The email can be changed one week after the last change.',
        },
      }
  }

  const validated = await changeEmailValidation.safeParseAsync({
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
        message: eErr.message,
      },
    }

  if (emailExists)
    return {
      errors: {
        message: 'The email is already registered.',
      },
    }

  const origin = headers().get('origin')

  const { error } = await supabase.auth.updateUser(
    {
      email: validated.data.newEmail,
    },
    {
      emailRedirectTo: `${origin}/api/auth/callback?next=/settings/account`,
    },
  )

  return {
    errors: {
      message: error?.message,
    },
  }
}

export const changePassword = async (_: unknown, formData: FormData) => {
  'use server'

  const supabase = createClient()

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  const validated = await changePasswordValidation.safeParseAsync({
    oldPassword: formData.get('old-password'),
    newPassword: formData.get('new-password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const { data, error } = await supabase.rpc('verify_user_password', {
    password: validated.data.oldPassword,
  })

  if (error)
    return {
      errors: {
        oldPassword: [error?.message],
      },
    }

  if (!data)
    return {
      errors: {
        oldPassword: ['The old password is not matched.'],
      },
    }

  const { error: updatedErr } = await supabase.auth.updateUser({
    password: validated.data.newPassword,
  })

  return {
    errors: {
      message: updatedErr?.message,
    },
  }
}

export const deleteAccount = async (_: unknown, formData: FormData) => {
  const supabase = createClient(true)

  const {
    data: { user },
    error: uErr,
  } = await supabase.auth.getUser()

  if (!user || uErr) return redirect('/sign-in')

  const validated = await deleteAccountValidation.safeParseAsync({
    password: formData.get('password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  await supabase.auth.signOut()
  await supabase.auth.admin.deleteUser(user.id)

  revalidatePath('/', 'layout')
}
