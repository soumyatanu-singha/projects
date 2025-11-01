import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

//POST: Create a new booking 
export async function POST(req) {
  try {
    const body = await req.json();
    const {
      userId,
      userName,
      userEmail,
      ambulanceId,
      ambulanceName,
      fare,
      fromLocation,
      toLocation,
    } = body;

    console.log("Booking request received:", body);
    // Validateee all required fields!!!!!!
    if (
      !userId ||
      !userName ||
      !userEmail ||
      !ambulanceId ||
      !ambulanceName ||
      !fare ||
      !fromLocation ||
      !toLocation
    ) {
      console.error("Missing required fields:", {
        userId: !!userId,
        userName: !!userName,
        userEmail: !!userEmail,
        ambulanceId: !!ambulanceId,
        ambulanceName: !!ambulanceName,
        fare: !!fare,
        fromLocation: !!fromLocation,
        toLocation: !!toLocation,
      });

      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 }
      );
    }

 
    const ambulance = await prisma.ambulance.findUnique({
      where: { id: ambulanceId },
    });

    if (!ambulance) {
      return NextResponse.json(
        { error: "Ambulance not found" },
        { status: 404 }
      );
    }

   
    const newBooking = await prisma.booking.create({
      data: {
        userId,
        ambulanceId,
        userName,
        userEmail,
        ambulanceName,
        fare: parseFloat(fare), 
        fromLocation,
        toLocation,
      },
    });

    console.log("Booking created successfully:", newBooking);

   
    return NextResponse.json(
      {
        success: true,
        message: "Booking created successfully",
        booking: newBooking,
        bookingId: newBooking.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { 
        error: "Failed to create booking",
        details: error.message 
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
