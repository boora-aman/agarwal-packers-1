import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Shipment from "@/models/Shipment"
import { verifyToken } from "@/lib/auth"

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
  console.log('Decoded Token:', decodedToken);
  if (!decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Acess" }, { status: 401 })
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
