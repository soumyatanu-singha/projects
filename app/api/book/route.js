
import { NextResponse } from "next/server";
import { createUser, getUserByEmail } from "/prisma/action";
import bcrypt from "bcryptjs";

<<<<<<< HEAD:ambulance-app/app/api/book/route.js

=======
>>>>>>> 76f95e8f5654f56376a6c3a2118e73786c169f2d:app/api/book/route.js
export async function POST(req) {
  try {
    const body = await req.json();
    const { fullName, email, phone,  password } = body;

    if (!fullName || !email || !phone || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already registered" },
        { status: 400 }
      );
    }

   
<<<<<<< HEAD:ambulance-app/app/api/book/route.js
    const hashedPassword = await bcrypt.hash(password, 10);

   
=======

  
    const hashedPassword = await bcrypt.hash(password, 10);

    
>>>>>>> 76f95e8f5654f56376a6c3a2118e73786c169f2d:app/api/book/route.js
    const newUser = await createUser({
      fullName,
      email,
      phone,
   
      password: hashedPassword,
    });

<<<<<<< HEAD:ambulance-app/app/api/book/route.js
    
=======
   
>>>>>>> 76f95e8f5654f56376a6c3a2118e73786c169f2d:app/api/book/route.js
    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error("Booking Signup Error:", error);

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

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
