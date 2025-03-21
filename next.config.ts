import withBundleAnalyzer from '@next/bundle-analyzer'

import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: false,
  serverExternalPackages: ['@node-rs/argon2'],
  webpack: (config) => {
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
    }

    return config
  },
}

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: false,
})(nextConfig)
