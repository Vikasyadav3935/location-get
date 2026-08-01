import { NextResponse } from "next/server";

// Dummy stand-in for the real pickup-slots API while that one is down.
// Any store_id/number pair is accepted and the same slot list is returned.
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const SLOTS_RESPONSE = {
  status: "success",
  store_id: 359,
  date: "2026-08-04",
  is_available: true,
  slots: [
    { slot_id: 3556004, timeslot_id: 2, time: "10 AM - 11 AM", start_time: 10, close_time: 11 },
    { slot_id: 3556005, timeslot_id: 3, time: "11 AM - 12 PM", start_time: 11, close_time: 12 },
    { slot_id: 3556006, timeslot_id: 4, time: "12 PM - 1 PM", start_time: 12, close_time: 13 },
    { slot_id: 3556007, timeslot_id: 5, time: "1 PM - 2 PM", start_time: 13, close_time: 14 },
    { slot_id: 3556008, timeslot_id: 6, time: "2 PM - 3 PM", start_time: 14, close_time: 15 },
    { slot_id: 3556009, timeslot_id: 7, time: "3 PM - 4 PM", start_time: 15, close_time: 16 },
    { slot_id: 3556010, timeslot_id: 8, time: "4 PM - 5 PM", start_time: 16, close_time: 17 },
    { slot_id: 3556011, timeslot_id: 9, time: "5 PM - 6 PM", start_time: 17, close_time: 18 },
    { slot_id: 3556012, timeslot_id: 10, time: "6 PM - 7 PM", start_time: 18, close_time: 19 },
  ],
  message:
    "🕒 *Pickup slots for Tuesday, 4 Aug*\n\n" +
    "1. 10 AM - 11 AM\n" +
    "2. 11 AM - 12 PM\n" +
    "3. 12 PM - 1 PM\n" +
    "4. 1 PM - 2 PM\n" +
    "5. 2 PM - 3 PM\n" +
    "6. 3 PM - 4 PM\n" +
    "7. 4 PM - 5 PM\n" +
    "8. 5 PM - 6 PM\n" +
    "9. 6 PM - 7 PM\n\n" +
    "Reply with the number (1-9) of your preferred slot.",
};

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: corsHeaders });
}

// Browsers send this preflight before a cross-origin POST with a JSON body.
export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

// POST { "store_id": "359", "number": "3" }
export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return json({ error: "Body must be valid JSON." }, 400);
  }

  const { store_id, number } = (body ?? {}) as {
    store_id?: unknown;
    number?: unknown;
  };

  // Strings or numbers both fine — the chatbot sends strings.
  if (store_id === undefined || store_id === null || store_id === "") {
    return json({ error: '"store_id" is required.' }, 400);
  }

  if (number === undefined || number === null || number === "") {
    return json({ error: '"number" is required.' }, 400);
  }

  return json(SLOTS_RESPONSE);
}
