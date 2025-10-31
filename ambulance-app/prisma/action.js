import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error", "warn"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

//
// 🔹 USER ACTIONS
//
export async function createUser(data) {
  try {
    return await prisma.user.create({ data });
  } catch (error) {
    if (error.code === "P2002") {
      const fields = error.meta?.target;
      if (fields.includes("email")) {
        return { error: "Email is already registered" };
      } else if (fields.includes("phone")) {
        return { error: "Phone number is already registered" };
      } else {
        return { error: "Duplicate field detected" };
      }
    }
    return { error: "Something went wrong" };
  }
}


export async function getUserByEmail(email) {
  return await prisma.user.findUnique({ where: { email } });
}

export async function getAllUsers() {
  return await prisma.user.findMany();
}

//
// 🔹 HOSPITAL ACTIONS
//
export async function createHospital({ name, email, phone, address, password }) {
  try {
    return await prisma.hospital.create({
      data: { name, email, phone, address, password },
    });
  } catch (error) {
    if (error.code === "P2002") {
      const fields = error.meta?.target; // array of conflicting fields
      if (fields.includes("email")) {
        return { error: "Email is already registered" };
      } else if (fields.includes("phone")) {
        return { error: "Phone number is already registered" };
      } else {
        return { error: "Duplicate field detected" };
      }
    }
    return { error: "Something went wrong" };
  }
}

export async function getHospitalByEmail(email) {
  return await prisma.hospital.findUnique({ where: { email } });
}

export async function getAllHospitals() {
  return await prisma.hospital.findMany({
    include: { ambulances: true },
  });
}

//
// 🔹 AMBULANCE ACTIONS
//
export async function createAmbulance(data) {
  return await prisma.ambulance.create({ data });
}

export async function updateAmbulanceStatus(id, status) {
  return await prisma.ambulance.update({
    where: { id },
    data: { status },
  });
}

export async function getAmbulancesByHospital(hospitalId) {
  return await prisma.ambulance.findMany({ where: { hospitalId } });
}

//
// 🔹 BOOKING ACTIONS
//
export async function createBooking(data) {
  return await prisma.booking.create({ data });
}

export async function getBookingsByUser(userId) {
  return await prisma.booking.findMany({
    where: { userId },
    include: { ambulance: true },
  });
}

export async function getBookingsByHospital(hospitalId) {
  return await prisma.booking.findMany({
    where: {
      ambulance: { hospitalId },
    },
    include: { user: true, ambulance: true },
  });
}

export async function updateBookingStatus(id, status) {
  return await prisma.booking.update({
    where: { id },
    data: { status },
  });
}
