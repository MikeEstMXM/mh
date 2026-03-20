const basePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH);

export const deploymentConfig = {
  basePath,
  isGithubPages: process.env.DEPLOY_TARGET === "github-pages",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
} as const;

export function withBasePath(path: `/${string}`) {
  return basePath ? `${basePath}${path}` : path;
}

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
