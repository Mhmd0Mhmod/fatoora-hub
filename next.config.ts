import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  output: "export",
  cacheComponents: false,
  partialPrefetching: false,
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
  },
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);