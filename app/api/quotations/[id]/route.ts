import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Quotation } from "@/models/Quotation"
import { verifyToken } from "@/lib/auth"

async function authenticateRequest(req: Request) {
  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decodedToken = verifyToken(token)
  if (!decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 })
  }

  return null // Authentication successful
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const authError = await authenticateRequest(req)
  if (authError) return authError

  try {
    const quotation = await Quotation.findById(params.id)
    if (!quotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }
    return NextResponse.json(quotation)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const authError = await authenticateRequest(req)
  if (authError) return authError

  try {
    const data = await req.json()
    const updatedQuotation = await Quotation.findByIdAndUpdate(params.id, data, { new: true })

    if (!updatedQuotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true, quotation: updatedQuotation })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect()
  const authError = await authenticateRequest(req)
  if (authError) return authError

  try {
    const deletedQuotation = await Quotation.findByIdAndDelete(params.id)
    if (!deletedQuotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

