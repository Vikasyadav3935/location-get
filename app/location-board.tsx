"use client";

import { useCallback, useEffect, useState } from "react";
import type { LocationEntry } from "@/app/lib/store";

export default function LocationBoard({
  initialEntries,
}: {
  initialEntries: LocationEntry[];
}) {
  const [entries, setEntries] = useState(initialEntries);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/location", { cache: "no-store" });
      const data = await res.json();
      setEntries(data.entries ?? []);
    } catch {
      // Ignore a transient poll failure; the next tick retries.
    }
  }, []);

  // Poll so locations POSTed from curl/Postman show up here too.
  useEffect(() => {
    const id = setInterval(load, 2000);
    return () => clearInterval(id);
  }, [load]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    const latitude = Number(lat);
    const longitude = Number(lng);

    if (lat.trim() === "" || !Number.isFinite(latitude) || Math.abs(latitude) > 90) {
      setError("Latitude must be a number between -90 and 90.");
      return;
    }

    if (lng.trim() === "" || !Number.isFinite(longitude) || Math.abs(longitude) > 180) {
      setError("Longitude must be a number between -180 and 180.");
      return;
    }

    setSending(true);

    try {
      const res = await fetch("/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ latitude, longitude }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
        return;
      }

      setLat("");
      setLng("");
      await load();
    } catch {
      setError("Could not reach the API.");
    } finally {
      setSending(false);
    }
  }

  async function handleClear() {
    await fetch("/api/location", { method: "DELETE" });
    await load();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-6 py-16">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Location receiver</h1>
        <p className="text-sm opacity-60">
          POST{" "}
          <code className="rounded bg-foreground/10 px-1 py-0.5">
            {'{ "latitude": 12.97, "longitude": 77.59 }'}
          </code>{" "}
          to <code className="rounded bg-foreground/10 px-1 py-0.5">/api/location</code> and it
          shows up below.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={lat}
          onChange={(e) => setLat(e.target.value)}
          placeholder="Latitude"
          className="flex-1 rounded-md border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
        <input
          type="number"
          inputMode="decimal"
          step="any"
          value={lng}
          onChange={(e) => setLng(e.target.value)}
          placeholder="Longitude"
          className="flex-1 rounded-md border border-foreground/20 px-3 py-2 text-sm outline-none focus:border-foreground/50"
        />
        <button
          type="submit"
          disabled={sending || lat.trim() === "" || lng.trim() === ""}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-40"
        >
          {sending ? "Sending…" : "Send"}
        </button>
      </form>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium uppercase tracking-wide opacity-50">
            Received ({entries.length})
          </h2>
          {entries.length > 0 && (
            <button
              onClick={handleClear}
              className="text-xs underline underline-offset-2 opacity-50 hover:opacity-100"
            >
              Clear
            </button>
          )}
        </div>

        {entries.length === 0 ? (
          <p className="text-sm opacity-50">Nothing yet. Send one above, or from your terminal.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {entries.map((entry) => (
              <li
                key={entry.id}
                className="flex items-baseline justify-between rounded-md border border-foreground/15 px-3 py-2"
              >
                <span className="font-medium">
                  {entry.latitude}, {entry.longitude}
                </span>
                <time className="text-xs opacity-40">
                  {new Date(entry.receivedAt).toLocaleTimeString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>

      <pre className="overflow-x-auto rounded-md bg-foreground/10 p-4 text-xs">
        {`curl -X POST http://localhost:3000/api/location \\
  -H "Content-Type: application/json" \\
  -d '{"latitude": 12.97, "longitude": 77.59}'`}
      </pre>
    </main>
  );
}
