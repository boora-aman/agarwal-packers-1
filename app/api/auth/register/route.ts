import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

const ADMIN_SECRET = "admin-secret-100704" // You should move this to .env in production

export async function POST(req: Request) {
  await dbConnect()

  try {
    const { username, password, adminSecret } = await req.json()

    // Check if user already exists
    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return NextResponse.json(
        { error: "Username already exists" },
        { status: 400 }
      )
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Check if this should be an admin user
    const isAdmin = adminSecret === ADMIN_SECRET

    // Create new user
    const user = await User.create({
      username,
      password: hashedPassword,
      isAdmin
    })

    return NextResponse.json(
      { 
        message: "User registered successfully", 
        isAdmin: user.isAdmin 
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "Error registering user" },
      { status: 500 }
    )
  }
}
