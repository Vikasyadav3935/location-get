export type LocationEntry = {
  id: string;
  location: string;
  receivedAt: string;
};

// In-memory store. Resets on server restart, and is per-process — fine for a
// demo, but swap for a DB if you ever run more than one instance.
const globalForStore = globalThis as unknown as {
  locationEntries?: LocationEntry[];
};

const entries: LocationEntry[] = (globalForStore.locationEntries ??= []);

const MAX_ENTRIES = 50;

export function addLocation(location: string): LocationEntry {
  const entry: LocationEntry = {
    id: crypto.randomUUID(),
    location,
    receivedAt: new Date().toISOString(),
  };

  entries.unshift(entry);
  entries.length = Math.min(entries.length, MAX_ENTRIES);

  return entry;
}

export function getLocations(): LocationEntry[] {
  return entries;
}

export function clearLocations(): void {
  entries.length = 0;
}
