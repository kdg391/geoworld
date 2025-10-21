export interface APIAccount {
  id: string
  user_id: string
  hashed_password: string | null
}

export interface Account {
  id: string
  userId: string
  hashedPassword: string | null
}
