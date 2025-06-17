import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: {
      fullUrl: true, //✅ (Terminal) data-fetching 관련 log 출력...
    }
  }
};

export default nextConfig;
