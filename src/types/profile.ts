export interface APIProfile {
  id: string
  avatar: APIAvatar | null
  bio: string | null
  display_name: string | null
  username: string | null
  is_public: boolean
  updated_at: string
}

export interface Profile {
  id: string
  avatar: Avatar | null
  bio: string | null
  displayName: string | null
  username: string | null
  isPublic: boolean
  updatedAt: Date
}

export interface APIAvatar {
  url: string | null
}

export interface Avatar {
  url: string | null
}
