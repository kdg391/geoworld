import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['@node-rs/argon2'],
}

export default nextConfig
