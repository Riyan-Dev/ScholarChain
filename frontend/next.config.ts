import { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com; object-src 'none';",
          },
        ],
      },
    ];
  },
};

export default nextConfig;