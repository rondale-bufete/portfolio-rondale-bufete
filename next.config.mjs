/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
    // Next 16.3 caches Turbopack build output by default and Vercel restores
    // that cache between deploys; a stale cached globals.css shipped the
    // project-page redesign without its styles. A clean build is cheap here.
    turbopackFileSystemCacheForBuild: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Allow public Supabase Storage assets.
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "cdn.simpleicons.org",
      },
    ],
  },
};

export default nextConfig;
