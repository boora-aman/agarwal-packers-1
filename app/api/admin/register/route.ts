import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { testConnection } from "@/lib/db";

export async function POST(req: Request) {
  // Test MongoDB connection
  const isConnected = await testConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  try {
    const { username, password, email } = await req.json();

    // Validate input
    if (!username || !password || !email) {
      return NextResponse.json(
        { error: "Please provide all required fields" },
        { status: 400 }
      );
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({
      $or: [{ username }, { email }],
    });

    if (existingAdmin) {
      return NextResponse.json(
        { error: "Admin with this username or email already exists" },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = new Admin({
      username,
      email,
      password, // Password will be hashed by the model's pre-save hook
    });

    await admin.save();

    return NextResponse.json(
      { 
        success: true,
        message: "Admin registered successfully",
        admin: {
          username: admin.username,
          email: admin.email,
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    return NextResponse.json(
      { error: "Error registering admin" },
      { status: 500 }
    );
  }
}
