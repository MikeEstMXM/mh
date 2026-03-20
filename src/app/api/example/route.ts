import { NextResponse } from "next/server";
import { sendExampleApiRequest } from "@/lib/server/example-api";
import type { ExampleApiResult } from "@/types/api";

export async function POST(request: Request): Promise<NextResponse<ExampleApiResult>> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        mode: "validation",
        message: "Request body must be valid JSON.",
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  const message = getValidatedMessage(body);

  if (!message) {
    return NextResponse.json(
      {
        ok: false,
        mode: "validation",
        message: "`message` must be a non-empty string up to 280 characters.",
      },
      {
        status: 400,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }

  // Do not move API keys into client components. Server-only modules belong in src/lib/server.
  const result = await sendExampleApiRequest({ message });

  return NextResponse.json(result, {
    status: result.ok ? 200 : 502,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

function getValidatedMessage(body: unknown) {
  if (!body || typeof body !== "object" || !("message" in body)) {
    return null;
  }

  const message = body.message;

  if (typeof message !== "string") {
    return null;
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage || trimmedMessage.length > 280) {
    return null;
  }

  return trimmedMessage;
}
