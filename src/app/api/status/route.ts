import { NextResponse } from "next/server";

export async function GET() {
  // Basic PATH system information that's always available
  const pathInfo = {
    system: "PATH (Port Authority Trans-Hudson)",
    description: "Rapid transit system connecting New York City and New Jersey",
    operatingHours: "24/7",
    totalStations: 13,
    totalLines: 4,
    lines: [
      "Newark-World Trade Center",
      "Hoboken-World Trade Center",
      "Journal Square-33rd Street",
      "Newark-33rd Street",
    ],
    stations: [
      "Newark",
      "Harrison",
      "Journal Square",
      "Grove Street",
      "Exchange Place",
      "World Trade Center",
      "Newport",
      "Hoboken",
      "Christopher Street",
      "9th Street",
      "14th Street",
      "23rd Street",
      "33rd Street",
    ],
    serviceArea: "New York City and New Jersey",
    lastUpdated: new Date().toISOString(),
    status: "operational",
  };

  return NextResponse.json(pathInfo, {
    headers: {
      "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
      "Content-Type": "application/json",
    },
  });
}
