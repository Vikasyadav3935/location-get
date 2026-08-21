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

// POST { "latitude": 12.97, "longitude": 77.59 }
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be valid JSON." }, 400);
  }

  const { latitude, longitude } = (body ?? {}) as {
    latitude?: unknown;
    longitude?: unknown;
  };

  if (typeof latitude !== "number" || !Number.isFinite(latitude) || Math.abs(latitude) > 90) {
    return json({ error: '"latitude" is required and must be a number between -90 and 90.' }, 400);
  }

  if (typeof longitude !== "number" || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
    return json(
      { error: '"longitude" is required and must be a number between -180 and 180.' },
      400,
    );
  }

  const entry = addLocation(latitude, longitude);

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
