import { NextResponse } from "next/server";

// Dummy stand-in for the real OTP-verification API while that one is down.
// Any mobile/otp pair is accepted and the same user payload is returned.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const USER = {
  id: 515595,
  name: "Vikas Yadav",
  email: "vikas.yadav44@uclean.in",
  mobile: "6387712911",
  device_id: "android",
  sex: null,
  dob: null,
  anniversary: null,
  gst_no: null,
  status: 1,
  source_id: null,
  created_at: "2026-07-27 06:22:35",
  updated_at: "2026-07-30 14:40:34",
  api_token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NTE1NTk1LCJpYXQiOjE3ODU1Njg4NTgsImV4cCI6MTc4ODE2MDg1OH0.uNuK9bQNKDbKyHbtlMHlGRy9Gy35DZqAhijUtA1ur-Y",
  is_deleted: 0,
  delete_reason: null,
  delete_reason_comment: null,
  otp_generated_at: "2026-08-01 12:50:25",
  country_id: 1,
  language_code: "en",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

// Browsers send this preflight before a cross-origin POST with a JSON body.
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// POST { "mobile": 6387712911, "otp": 999999 }
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be valid JSON." }, 400);
  }

  const { mobile, otp } = (body ?? {}) as { mobile?: unknown; otp?: unknown };

  // Numbers or strings both fine — the real client sends numbers.
  if (mobile === undefined || mobile === null || mobile === "") {
    return json({ error: '"mobile" is required.' }, 400);
  }

  if (otp === undefined || otp === null || otp === "") {
    return json({ error: '"otp" is required.' }, 400);
  }

  return json(USER);
}
