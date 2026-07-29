//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next',
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
