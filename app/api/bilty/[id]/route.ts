import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Bilty } from "@/models/Bilty"
import { verifyToken } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const bilty = await Bilty.findById(params.id)

    if (!bilty) {
      return NextResponse.json(
        { error: "Bilty not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(bilty)
  } catch (error) {
    console.error("Error fetching bilty:", error)
    return NextResponse.json(
      { error: "Failed to fetch bilty" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const data = await req.json()

    const bilty = await Bilty.findByIdAndUpdate(
      params.id,
      { ...data, date: new Date(data.date) },
      { new: true }
    )

    if (!bilty) {
      return NextResponse.json(
        { error: "Bilty not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(bilty)
  } catch (error) {
    console.error("Error updating bilty:", error)
    return NextResponse.json(
      { error: "Failed to update bilty" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const bilty = await Bilty.findByIdAndDelete(params.id)

    if (!bilty) {
      return NextResponse.json(
        { error: "Bilty not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bilty:", error)
    return NextResponse.json(
      { error: "Failed to delete bilty" },
      { status: 500 }
    )
  }
}

