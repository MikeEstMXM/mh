import type { NextConfig } from "next";

const deployTarget = process.env.DEPLOY_TARGET;
const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);
const isGithubPages = deployTarget === "github-pages";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGithubPages ? "export" : undefined,
  trailingSlash: isGithubPages,
  images: {
    unoptimized: isGithubPages,
  },
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;

function normalizeBasePath(value: string | undefined) {
  if (!value) {
    return "";
  }

  const trimmedValue = value.trim();

  if (!trimmedValue || trimmedValue === "/") {
    return "";
  }

  return trimmedValue.startsWith("/") ? trimmedValue : `/${trimmedValue}`;
}
