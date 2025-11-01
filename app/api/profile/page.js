import { prisma } from "@/prisma/action";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) return NextResponse.json({ error: "Missing email" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email } });
  const hospital = await prisma.hospital.findUnique({ where: { email } });

  if (user)
    return NextResponse.json({ ...user, role: "user" });
  if (hospital)
    return NextResponse.json({ ...hospital, role: "hospital" });

  return NextResponse.json({ error: "No profile found" }, { status: 404 });
}
