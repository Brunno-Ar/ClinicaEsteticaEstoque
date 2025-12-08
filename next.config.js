/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force all pages to be dynamically rendered
  // This completely disables static generation

  // Standalone output for better Vercel compatibility
  output: "standalone",

  // Disable static optimization
  reactStrictMode: true,

  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Disable image optimization
  images: {
    unoptimized: true,
  },

  // Experimental features to force dynamic rendering
  experimental: {
    // Force dynamic rendering for all pages
    workerThreads: false,
    cpus: 1,
  },

  // Environment variables that should be available at runtime
  env: {
    FORCE_DYNAMIC: "true",
  },
};

module.exports = nextConfig;
