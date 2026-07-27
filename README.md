# location-get

A minimal Next.js app with an open (unauthenticated) API that accepts a location
and displays it on the UI.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## API

Base path: `/api/location`. No auth. CORS is open (`Access-Control-Allow-Origin: *`),
so it can be called from any origin.

### `POST /api/location`

```bash
curl -X POST http://localhost:3000/api/location \
  -H "Content-Type: application/json" \
  -d '{"location": "Bengaluru"}'
```

| Response | Meaning |
| --- | --- |
| `201` `{ ok: true, entry: { id, location, receivedAt } }` | Accepted |
| `400` `{ error }` | Body isn't valid JSON, or `location` is missing/empty/not a string |

### `GET /api/location`

Returns `{ entries: [...] }`, newest first. The UI polls this every 2 seconds so
values POSTed from curl or Postman show up on screen.

### `DELETE /api/location`

Clears the list.

### `OPTIONS /api/location`

CORS preflight — browsers send this automatically before a cross-origin POST
with a JSON body.

## Structure

| File | Role |
| --- | --- |
| `app/api/location/route.ts` | The API route handler |
| `app/lib/store.ts` | In-memory store, newest first, capped at 50 |
| `app/page.tsx` | Server component — renders the current list at request time |
| `app/location-board.tsx` | Client UI — form, list, polling |

## Caveat

The store is in memory, so it resets whenever the server restarts, and it is
per-process — on a multi-instance deployment a POST and a GET can hit different
instances and disagree. Swap it for Redis or a database before relying on it.
