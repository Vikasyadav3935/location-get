import { NextResponse } from "next/server";
import { addLocation, clearLocations, getLocations } from "@/app/lib/store";

// Open API: no auth, callable from any origin.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

// Browsers send this preflight before a cross-origin POST with a JSON body.
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// POST { "location": "some value" }
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be valid JSON." }, 400);
  }

  const location = (body as { location?: unknown } | null)?.location;

  if (typeof location !== "string" || location.trim() === "") {
    return json({ error: '"location" is required and must be a non-empty string.' }, 400);
  }

  const entry = addLocation(location.trim());

  return json({ ok: true, entry }, 201);
}

// GET -> everything received so far, newest first. The UI polls this.
export async function GET() {
  return json({ entries: getLocations() });
}

// DELETE -> wipe the list (handy while testing).
export async function DELETE() {
  clearLocations();
  return json({ ok: true });
}
