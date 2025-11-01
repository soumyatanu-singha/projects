import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    console.log("📩Received email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Try finding the user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (user) {
      console.log("Found User:", user.email);
      const { password, ...safeUser } = user;
      return NextResponse.json(safeUser, { status: 200 });
    }

    // If not found as user, check hospital
    const hospital = await prisma.hospital.findUnique({
      where: { email },
    });

    if (hospital) {
      console.log("Found Hospital:", hospital.email);
      const { password, ...safeHospital } = hospital;
      return NextResponse.json(safeHospital, { status: 200 });
    }

    console.log(" No matching record found.");
    return NextResponse.json({ error: "No user or hospital found" }, { status: 404 });
  } catch (error) {
    console.error(" Error fetching profile:", error);
    return NextResponse.json(
      { error: "Internal Server Error", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
