/** @type {import('next').NextConfig} */
const nextConfig = {
  experemental: {
    turbo: false
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.tmdb.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
}

export default nextConfig
