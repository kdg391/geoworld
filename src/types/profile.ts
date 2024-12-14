export interface APIProfile {
  id: string
  avatar: {
    url: string | null
  } | null
  bio: string | null
  display_name: string | null
  username: string | null
  is_public: boolean
  updated_at: string
}

export interface Profile {
  id: string
  avatar: {
    url: string | null
  } | null
  bio: string | null
  displayName: string | null
  username: string | null
  isPublic: boolean
  updatedAt: Date
}
