/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  experimental: {
    serverActions: true,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  skipMiddlewareUrlNormalize: true,
};

module.exports = nextConfig;
