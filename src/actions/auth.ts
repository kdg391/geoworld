'use server'

import { revalidatePath } from 'next/cache'
// import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { createClient } from '../utils/supabase/server.js'

import {
  resetPasswordValidation,
  signUpValidation,
  signInValidation,
  updatePasswordValidation,
} from '../utils/validations/auth.js'

import type { FormState as ResetPasswordFormState } from '../app/(auth)/forgot-password/Form.js'
import type { FormState as UpdatePasswordFormState } from '../app/(auth)/reset-password/Form.js'
import type { FormState as SignInFormState } from '../app/(auth)/sign-in/Form.js'
import type { FormState as SignUpFormState } from '../app/(auth)/sign-up/Form.js'

export const signUp = async (_: SignUpFormState, formData: FormData) => {
  'use server'
  const validated = await signUpValidation.safeParseAsync({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient(true)

  const { error } = await supabase.auth.admin.createUser({
    email: validated.data.email.trim(),
    password: validated.data.password,
    email_confirm: true,
    user_metadata: {
      username: validated.data.email.trim().split('@')[0],
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

export const signIn = async (_: SignInFormState, formData: FormData) => {
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
  return redirect('/')
}

export const signOut = async () => {
  'use server'
  const supabase = createClient()
  await supabase.auth.signOut()

  /*const referrer = headers().get('x-next-pathname')

  revalidatePath('/', 'layout')

  if (referrer) redirect(referrer)

  redirect('/sign-in')*/
}

export const resetPassword = async (
  _: ResetPasswordFormState,
  formData: FormData,
) => {
  'use server'
  const validated = await resetPasswordValidation.safeParseAsync({
    email: formData.get('email'),
  })

  if (!validated.success)
    return {
      errors: validated.error.flatten().fieldErrors,
    }

  const supabase = createClient()

  const { error } = await supabase.auth.resetPasswordForEmail(
    validated.data.email,
    {
      redirectTo: 'http://localhost:3000/reset-password',
    },
  )

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  return redirect('/forgot-password/done')
}

export const updatePassword = async (
  _: UpdatePasswordFormState,
  formData: FormData,
) => {
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

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
  })

  if (error)
    return {
      errors: {
        message: error.message,
      },
    }

  return redirect('/sign-in')
}
