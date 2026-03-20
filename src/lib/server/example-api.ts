import "server-only";
import { getExampleApiConfig } from "@/lib/server/env";
import type { ExampleApiResult } from "@/types/api";

type ExampleRequest = {
  message: string;
};

export async function sendExampleApiRequest({
  message,
}: ExampleRequest): Promise<ExampleApiResult> {
  const config = getExampleApiConfig();

  if (!config) {
    return {
      ok: true,
      mode: "stub",
      message:
        "External API is not configured yet. Add EXAMPLE_API_BASE_URL and EXAMPLE_API_KEY on the server before wiring a live integration.",
    };
  }

  try {
    // Keep external API calls on the server. Client components should call
    // route handlers, never third-party APIs with secrets directly.
    const response = await fetch(new URL("/echo", config.baseUrl), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message }),
      cache: "no-store",
    });

    if (!response.ok) {
      return {
        ok: false,
        mode: "live",
        message: `External API request failed with status ${response.status}.`,
      };
    }

    const data = (await response.json().catch(() => null)) as { reply?: unknown } | null;
    const reply =
      typeof data?.reply === "string"
        ? data.reply
        : "External API responded, but no typed reply field was present.";

    return {
      ok: true,
      mode: "live",
      message: reply,
    };
  } catch {
    return {
      ok: false,
      mode: "live",
      message: "External API request failed before a valid response was returned.",
    };
  }
}
