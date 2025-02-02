import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin"; // Correct import
import { config } from "dotenv";

config(); // To load environment variables if needed

const ADMIN_SECRET = process.env.ADMIN_SECRET; // Make sure it's defined in .env

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, password, email, adminSecret } = await req.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ username });
    if (existingAdmin) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Check if the admin secret matches
    if (adminSecret !== ADMIN_SECRET) {
      return NextResponse.json(
        { error: "Invalid admin secret" },
        { status: 403 }
      );
    }

    // Create new admin
    const admin = await Admin.create({
      username,
      password: hashedPassword,
      email, // Added email
    });

    return NextResponse.json(
      {
        message: "Admin registered successfully",
        isAdmin: true,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Error registering admin" },
      { status: 500 }
    );
  }
}
