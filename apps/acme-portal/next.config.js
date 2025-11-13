/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // output: 'standalone',
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001'],
    },
  },
  env: {
    TENANT_ID: process.env.TENANT_ID,
    TENANT_NAME: process.env.TENANT_NAME,
  },
}

module.exports = nextConfig
