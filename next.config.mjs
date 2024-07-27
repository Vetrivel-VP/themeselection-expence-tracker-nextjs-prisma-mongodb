/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: process.env.BASEPATH,
  eslint: {
    ignoreDuringBuilds: true
  }
}

export default nextConfig

// npm uninstall eslint eslint-config-next eslint-plugin-next
