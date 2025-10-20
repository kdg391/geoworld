export interface APIAccount {
  id: string
  provider: 'credentials' | 'email' | 'discord'
  account_id: string
  user_id: string
  access_token: string | null
  access_token_expires_at: string | null
  refresh_token: string | null
  refresh_token_expires_at: string | null
  scope: string | null
  id_token: string | null
  hashed_password: string | null
}

export interface Account {
  id: string
  provider: 'credentials' | 'email' | 'discord'
  accountId: string
  userId: string
  accessToken: string | null
  accessTokenExpiresAt: Date | null
  refreshToken: string | null
  refreshTokenExpiresAt: Date | null
  scope: string | null
  idToken: string | null
  hashedPassword: string | null
}
