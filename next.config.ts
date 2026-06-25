import path from 'path'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(__dirname),
  async redirects() {
    return [
      {
        source: '/',
        destination: '/checklist',
        permanent: false,
      },
    ]
  },
}

export default nextConfig
