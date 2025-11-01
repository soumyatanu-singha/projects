import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

/** Haversine distance between two lat/lon points (in km) */
function haversineDistance([lat1, lon1], [lat2, lon2]) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const R = 6371; // Earth's radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  lat1 = toRad(lat1);
  lat2 = toRad(lat2);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return R * 2 * Math.asin(Math.sqrt(a));
}

/** Convert address to coordinates using Nominatim API */
async function geocodeLocation(address) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`,
      {
        headers: { "User-Agent": "Next.js Ambulance Finder" },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch geocode data");
    const data = await res.json();
    if (!data?.length) throw new Error("Invalid address");

    return {
      lat: parseFloat(data[0].lat),
      lon: parseFloat(data[0].lon),
    };
  } catch (err) {
    console.error("Geocoding failed:", err);
    throw err;
  }
}

//POST: Find nearby ambulances
export async function POST(req) {
  try {
    const { fromLocation, toLocation } = await req.json();

    if (!fromLocation || !toLocation) {
      return NextResponse.json(
        { error: "Both from and to locations are required" },
        { status: 400 }
      );
    }

    const [fromCoords, toCoords] = await Promise.all([
      geocodeLocation(fromLocation),
      geocodeLocation(toLocation),
    ]);

    const ambulances = await prisma.ambulance.findMany({
      where: {
        lat: { not: null },
        lon: { not: null },
      },
    });

    const nearby = ambulances
      .map((amb) => ({
        ...amb,
        distance: haversineDistance(
          [fromCoords.lat, fromCoords.lon],
          [amb.lat, amb.lon]
        ),
      }))
      .filter((amb) => amb.distance <= 10)
      .sort((a, b) => a.distance - b.distance);

    return NextResponse.json(
      { fromCoords, toCoords, nearby, count: nearby.length },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error locating nearby ambulances:", error);
    return NextResponse.json(
      { error: "Failed to find nearby ambulances" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing ambulance id" },
        { status: 400 }
      );
    }

   const ambulance = await prisma.ambulance.findUnique({
  where: { id },
  select: { id: true, lat: true, lon: true, status: true },
});


    if (!ambulance) {
      return NextResponse.json(
        { error: "Ambulance not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        location: {
          lat: ambulance.lat,
          lon: ambulance.lon,
          address: ambulance.status,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching ambulance:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}