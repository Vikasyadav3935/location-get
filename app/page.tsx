import { connection } from "next/server";
import { getLocations } from "@/app/lib/store";
import LocationBoard from "./location-board";

export default async function Home() {
  // The store is read synchronously, so opt out of prerendering to get the
  // list as it is at request time rather than at build time.
  await connection();

  return <LocationBoard initialEntries={getLocations()} />;
}
