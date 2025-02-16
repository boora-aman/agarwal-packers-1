import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Quotation } from "@/models/Quotation"
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
    const quotation = await Quotation.findById(params.id)

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error fetching quotation:", error)
    return NextResponse.json(
      { error: "Failed to fetch quotation" },
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

    const quotation = await Quotation.findByIdAndUpdate(
      params.id,
      { ...data, date: new Date(data.date) },
      { new: true }
    )

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(quotation)
  } catch (error) {
    console.error("Error updating quotation:", error)
    return NextResponse.json(
      { error: "Failed to update quotation" },
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
    const quotation = await Quotation.findByIdAndDelete(params.id)

    if (!quotation) {
      return NextResponse.json(
        { error: "Quotation not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting quotation:", error)
    return NextResponse.json(
      { error: "Failed to delete quotation" },
      { status: 500 }
    )
  }
}

