// app/api/book-signup/route.js
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "/prisma/action";
import bcrypt from "bcryptjs";

// POST: Register a new user (booking)
export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone,  password } = body;

    // 1️⃣ Validate all fields
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // 2️⃣ Check if email or phone already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

    // Optional: You can also check phone uniqueness manually if needed:
    // const existingPhone = await prisma.user.findUnique({ where: { phone } });

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4️⃣ Create user in database
    const newUser = await createUser({
      fullName,
      email,
      phone,
   
      password: hashedPassword,
    });

    // 5️⃣ Return success response
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking Signup Error:", error);

    // Handle Prisma unique constraint errors (in case phone/email conflict)
    if (error.code === "P2002") {
      const fields = error.meta?.target;
      if (fields.includes("email")) {
        return NextResponse.json(
          { error: "Email is already registered" },
          { status: 400 }
        );
      }
      if (fields.includes("phone")) {
        return NextResponse.json(
          { error: "Phone number is already registered" },
          { status: 400 }
        );
      }
    }

    // Fallback error
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
