import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Helper: get coordinates using OpenStreetMap API
async function getCoordinates(location) {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}`
    );
    const data = await res.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
      };
    } else {
      return { lat: null, lon: null };
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
    return { lat: null, lon: null };
  }
}

// GET all ambulances
export async function GET() {
  try {
    const drivers = await prisma.ambulance.findMany();
    return NextResponse.json(drivers);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch ambulances" }, { status: 500 });
  }
}

// CREATE new ambulance
export async function POST(req) {
  try {
   const { id, name, location, fare } = await req.json();

let lat, lon;

if (location) { // ONLY geocode if a new location string is provided
  ({ lat, lon } = await getCoordinates(location));
} else {
  // Otherwise, ensure lat/lon are not included in the data object for update, 
  // so they keep their current values.
  lat = undefined; 
  lon = undefined; 
}

    const newAmbulance = await prisma.ambulance.create({
      data: {
        type: name,
        status: location,
        fare: fare ? parseFloat(fare) : undefined,
        lat,
        lon,
      },
    });

    return NextResponse.json(newAmbulance);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create ambulance" }, { status: 500 });
  }
}

// UPDATE ambulance
export async function PUT(req) {
  try {
    const { id, name, location, fare } = await req.json();

    // Convert new location to coordinates if provided
    const { lat, lon } = await getCoordinates(location);

    const updated = await prisma.ambulance.update({
      where: { id },
      data: {
        type: name,
        status: location,
        fare: fare ? parseFloat(fare) : undefined,
        lat,
        lon,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update ambulance" }, { status: 500 });
  }
}

// DELETE ambulance
export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await prisma.ambulance.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete ambulance" }, { status: 500 });
  }
}
