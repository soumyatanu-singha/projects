import { NextResponse } from "next/server";
import { createHospital } from "/prisma/action";
import bcrypt from "bcryptjs";

// POST 
export async function POST(req) {
  try {
    const body = await req.json();
    const { hospitalName, email, phone, address, password } = body;

    if (!hospitalName || !email || !phone || !address || !password) {
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await createHospital({
      name: hospitalName,
      email,
      phone,
      address,
      password: hashedPassword,
    });

    
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, hospital: result }, { status: 201 });
  } catch (err) {
    console.error("Hospital Signup Error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
