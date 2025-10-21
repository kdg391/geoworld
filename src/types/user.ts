export type UserRole = 'admin'

export type APIUser = {
  id: string
  created_at: string
  role: UserRole
}

export type User = {
  id: string
  createdAt: string
  role: string
}
