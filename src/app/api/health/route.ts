import { NextResponse } from "next/server";
import { getPublicServerHealth } from "@/lib/server/env";
import type { HealthResponse } from "@/types/api";

export async function GET(): Promise<NextResponse<HealthResponse>> {
  const response: HealthResponse = {
    ok: true,
    service: "personal-app-platform",
    timestamp: new Date().toISOString(),
    environment: getPublicServerHealth(),
  };

  return NextResponse.json(response, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
