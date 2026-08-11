/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        // Matches https://<project-ref>.supabase.co/storage/v1/object/public/...
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
