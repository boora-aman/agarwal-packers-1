import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Shipment from "@/models/Shipment"
import { verifyToken } from "@/lib/auth"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decodedToken = verifyToken(token)
  if (!decodedToken || 'error' in decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 })
  }

  try {
    const shipment = await Shipment.findById(params.id)
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Convert to plain object and format dates
    const shipmentObj = JSON.parse(JSON.stringify(shipment))
    const formattedShipment = {
      ...shipmentObj,
      _id: shipmentObj._id?.toString(),
      bookingDate: new Date(shipmentObj.bookingDate).toISOString(),
      estimatedDelivery: new Date(shipmentObj.estimatedDelivery).toISOString(),
      transitStops: shipmentObj.transitStops?.map((stop: any) => ({
        ...stop,
        expectedArrival: new Date(stop.expectedArrival).toISOString(),
        expectedDeparture: new Date(stop.expectedDeparture).toISOString()
      })) || [],
      updates: shipmentObj.updates?.map((update: any) => ({
        ...update,
        date: new Date(update.date).toISOString()
      })) || []
    }

    return NextResponse.json(formattedShipment)
  } catch (error) {
    console.error("GET /api/shipments/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to fetch shipment" },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decodedToken = verifyToken(token)
  if (!decodedToken || 'error' in decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 })
  }

  try {
    const shipmentData = await req.json()
    console.log("Updating shipment:", params.id, "with data:", shipmentData)

    const shipment = await Shipment.findById(params.id)
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    // Update allowed fields
    const allowedUpdates = [
      "trackingNumber",
      "customerName",
      "customerMobile",
      "status",
      "origin",
      "destination",
      "currentLocation",
      "estimatedDelivery",
      "bookingDate",
      "transitStops",
      "updates"
    ]

    allowedUpdates.forEach((update) => {
      if (update in shipmentData) {
        shipment[update] = shipmentData[update]
      }
    })

    // Save the updated shipment
    await shipment.save()

    // Convert to plain object and format dates
    const updatedShipment = JSON.parse(JSON.stringify(shipment))
    const formattedShipment = {
      ...updatedShipment,
      _id: updatedShipment._id?.toString(),
      bookingDate: new Date(updatedShipment.bookingDate).toISOString(),
      estimatedDelivery: new Date(updatedShipment.estimatedDelivery).toISOString(),
      transitStops: updatedShipment.transitStops?.map((stop: any) => ({
        ...stop,
        expectedArrival: new Date(stop.expectedArrival).toISOString(),
        expectedDeparture: new Date(stop.expectedDeparture).toISOString()
      })) || [],
      updates: updatedShipment.updates?.map((update: any) => ({
        ...update,
        date: new Date(update.date).toISOString()
      })) || []
    }

    return NextResponse.json(formattedShipment)
  } catch (error: any) {
    console.error("PUT /api/shipments/[id] error:", error)

    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      )
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to update shipment" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await dbConnect()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decodedToken = verifyToken(token)
  if (!decodedToken || 'error' in decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 })
  }

  try {
    const shipment = await Shipment.findByIdAndDelete(params.id)
    if (!shipment) {
      return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Shipment deleted successfully" })
  } catch (error) {
    console.error("DELETE /api/shipments/[id] error:", error)
    return NextResponse.json(
      { error: "Failed to delete shipment" },
      { status: 500 }
    )
  }
}