/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost'],
    unoptimized: false,
  },
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig

