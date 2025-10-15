/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    dirs: ["src"]
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  },
  allowedDevOrigins: ["*.srv.us"]
};

export default nextConfig;
