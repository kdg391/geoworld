export interface APIAccount {
  id: string
  provider: 'credentials'
  account_id: string
  user_id: string
  hashed_password: string | null
}

export interface Account {
  id: string
  provider: 'credentials'
  accountId: string
  userId: string
  hashedPassword: string | null
}
