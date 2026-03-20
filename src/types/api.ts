export type HealthResponse = {
  ok: true;
  service: string;
  timestamp: string;
  environment: {
    nodeEnv: string;
    hasSiteUrl: boolean;
    hasExampleApiBaseUrl: boolean;
    hasExampleApiKey: boolean;
  };
};

export type ExampleApiResult = {
  ok: boolean;
  mode: "stub" | "live" | "validation";
  message: string;
};
