import "server-only";

type PublicServerHealth = {
  nodeEnv: string;
  hasSiteUrl: boolean;
  hasExampleApiBaseUrl: boolean;
  hasExampleApiKey: boolean;
};

export function getPublicServerHealth(): PublicServerHealth {
  return {
    nodeEnv: process.env.NODE_ENV ?? "development",
    hasSiteUrl: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
    hasExampleApiBaseUrl: Boolean(getValidatedUrl(process.env.EXAMPLE_API_BASE_URL)),
    hasExampleApiKey: Boolean(process.env.EXAMPLE_API_KEY),
  };
}

export function getExampleApiConfig() {
  const baseUrl = getValidatedUrl(process.env.EXAMPLE_API_BASE_URL);
  const apiKey = process.env.EXAMPLE_API_KEY?.trim();

  if (!baseUrl || !apiKey) {
    return null;
  }

  return {
    baseUrl,
    apiKey,
  };
}

function getValidatedUrl(value: string | undefined) {
  if (!value) {
    return null;
  }

  try {
    return new URL(value).toString();
  } catch {
    return null;
  }
}
