import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Admin from "@/models/Admin";
import { testConnection } from "@/lib/db";

export async function POST(req: Request) {
  // Test MongoDB connection
  const isConnected = await testConnection();
  if (!isConnected) {
    return NextResponse.json({ error: "Database connection failed" }, { status: 500 });
  }

  const { username, password } = await req.json();

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);

    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { 
        adminId: admin._id,
        username: admin.username,
        email: admin.email
      }, 
      process.env.JWT_SECRET!, 
      { expiresIn: "24h" }
    );

    // Set HTTP-only cookie
    const response = NextResponse.json({ 
      success: true,
      admin: {
        username: admin.username,
        email: admin.email
      }
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400 // 24 hours
    });

    return response;
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
