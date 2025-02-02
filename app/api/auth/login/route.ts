import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

export async function POST(req: Request) {
  await dbConnect()

  const { username, password } = await req.json()
  
  console.log("Login attempt for username:", username)

  try {
    const user = await User.findOne({ username })

    if (!user) {
      console.log("User not found:", username)
      return NextResponse.json({ error: "User not found" }, { status: 401 })
    }

    console.log("User found, comparing passwords")
    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      console.log("Password mismatch for user:", username)
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 })
    }

    console.log("Password matched, generating token")
    const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.NEXTAUTH_SECRET!, { expiresIn: "1h" })

    console.log("Login successful for user:", username)
    return NextResponse.json({ token, isAdmin: user.isAdmin })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
