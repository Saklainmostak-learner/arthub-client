/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination:
          "https://arthub-server-k64r.onrender.com/api/auth/:path*",
      },
      {
        source: "/api/backend/:path*",
        destination:
          "https://arthub-server-k64r.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;