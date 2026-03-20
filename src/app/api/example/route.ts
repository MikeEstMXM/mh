import { NextResponse } from "next/server";
import { getPublicServerHealth } from "@/lib/server/env";
import type { ExampleApiResult } from "@/types/api";

export const dynamic = "force-static";

export async function GET(): Promise<NextResponse<ExampleApiResult>> {
  const environment = getPublicServerHealth();
  const hasServerRuntime = environment.hasExampleApiBaseUrl && environment.hasExampleApiKey;

  return NextResponse.json(
    {
      ok: true,
      mode: hasServerRuntime ? "live" : "stub",
      message: hasServerRuntime
        ? "Server-side API configuration is present. For live proxying, deploy this repo to a server runtime such as Vercel."
        : "GitHub Pages is static hosting. Keep this route as a status stub here, and use a server runtime when you need live secret-backed API proxying.",
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
