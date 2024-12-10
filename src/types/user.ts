export type UserRole = 'user' | 'admin' | 'guest'

export type APIUser = {
  id: string
  created_at: string
  email: string
  role: UserRole
} & (
  | {
      email_verified: true
      email_verified_at: string
    }
  | {
      email_verified: false
      email_verified_at: null
    }
)

export type User = {
  id: string
  createdAt: string
  email: string
  role: string
} & (
  | {
      emailVerified: true
      emailVerifiedAt: Date
    }
  | {
      emailVerified: false
      emailVerifiedAt: null
    }
)
