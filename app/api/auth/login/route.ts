import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import Admin from "@/models/Admin"; // Use Admin model

export async function POST(req: Request) {
  await dbConnect();

  const { username, password } = await req.json();
  console.log("Login attempt for admin:", username);

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("Admin not found:", username);
      return NextResponse.json({ error: "Admin not found" }, { status: 401 });
    }

    console.log("Admin found, comparing passwords");
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      console.log("Password mismatch for admin:", username);
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }

    console.log("Password matched, generating token");
    const token = jwt.sign(
      { adminId: admin._id }, 
      process.env.NEXTAUTH_SECRET!, 
      { expiresIn: "1h" }
    );

    console.log("Login successful for admin:", username);
    return NextResponse.json({ token, isAdmin: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
