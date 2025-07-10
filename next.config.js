/** @type {import('next').NextConfig} */
const nextConfig = {
  // Generate build ID for cache busting
  generateBuildId: async () => {
    // Use timestamp for build ID to ensure unique builds
    return `build-${Date.now()}`;
  },
  // PWA Configuration with enhanced cache control
  async headers() {
    return [
      {
        // Service worker should never be cached
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate, no-cache, no-store",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
      {
        // Manifest should have short cache
        source: "/manifest.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=300, must-revalidate",
          },
        ],
      },
      {
        // HTML pages should be revalidated frequently
        source: "/((?!_next|api|favicon.ico).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
      {
        // API routes should not be cached
        source: "/api/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
      },
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Content-Type",
            value: "application/xml",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/sw.js",
        destination: "/sw.js",
      },
    ];
  },
  // Optimize for production builds
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
            exclude: ["error"],
          }
        : false,
  },
  // Enable experimental features for better caching
  swcMinify: true,
};

module.exports = nextConfig;
