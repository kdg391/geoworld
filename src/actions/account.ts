'use server'

import { hash, verify } from '@node-rs/argon2'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { db } from '../db/index.ts'
import { accountsTable, usersTable } from '../db/schema.ts'
import { passwordOptions } from '../lib/password.ts'
import {
  deleteSessionTokenCookie,
  getCurrentSession,
  invalidateSession,
} from '../lib/session.ts'
import {
  changeEmailSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from '../utils/validations/auth.ts'

import { checkEmailExists } from './auth.ts'

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
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const emailExists = await checkEmailExists(validated.data.newEmail)

  if (emailExists)
    return {
      errors: {
        message: 'The email is already registered.',
      },
    }

  await db
    .update(usersTable)
    .set({
      email: validated.data.newEmail,
      emailVerified: false,
    })
    .where(eq(usersTable.id, user.id))

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

  const validated = await changePasswordSchema.safeParseAsync({
    oldPassword: formData.get('old-password'),
    newPassword: formData.get('new-password'),
    confirmPassword: formData.get('confirm-password'),
  })

  if (!validated.success)
    return {
      errors: z.flattenError(validated.error).fieldErrors,
    }

  const accountResult = await db
    .select()
    .from(accountsTable)
    .where(
      and(
        eq(accountsTable.provider, 'credentials'),
        eq(accountsTable.userId, user.id),
      ),
    )

  const account = accountResult[0] ?? null

  if (account === null)
    return {
      errors: {
        message: 'Failed to load your data.',
      },
    }

  const isPwMatched = await verify(
    account.hashedPassword as string,
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

  await db
    .update(accountsTable)
    .set({
      hashedPassword,
    })
    .where(
      and(
        eq(accountsTable.provider, 'credentials'),
        eq(accountsTable.userId, user.id),
      ),
    )

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
      errors: z.flattenError(validated.error).fieldErrors,
    }

  await db.delete(usersTable).where(eq(usersTable.id, user.id))

  await invalidateSession(session.id)
  await deleteSessionTokenCookie()

  revalidatePath('/', 'layout')
  redirect('/')
}
