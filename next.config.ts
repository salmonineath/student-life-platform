import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
};

module.exports = {
  allowedDevOrigins: ['radar-manhattan-navy-wma.trycloudflare.com'],
}
export default nextConfig;
