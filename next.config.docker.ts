import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker
  output: 'standalone',
  
  // Disable telemetry
  // telemetry: {
  //   enabled: false
  // },

  // Optimize images
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },

  // Production optimizations
  compress: true,
  poweredByHeader: false,

  // Experimental features
  experimental: {
    // optimizePackageImports: ['lucide-react'],
  },

  // Environment variables available to the browser
  env: {
    NEXT_PUBLIC_APP_NAME: 'MotoPH Studio',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

export default nextConfig;
