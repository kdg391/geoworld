import { Discord } from 'arctic'

export const discord = new Discord(
  process.env.DISCORD_CLIENT_ID as string,
  process.env.DISCORD_CLIENT_SECRET as string,
  `${process.env.NEXT_PUBLIC_URL}/api/auth/discord/callback`,
)
