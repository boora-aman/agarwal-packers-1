import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Shipment from "@/models/Shipment"
import {verifyToken } from "@/lib/auth"
import jwt from "jsonwebtoken"
export async function GET(req: Request) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const trackingNumber = searchParams.get("trackingNumber")

  try {
    if (trackingNumber) {
      console.log("Searching for tracking number:", trackingNumber)
      
      const shipment = await Shipment.findOne({ trackingNumber: trackingNumber.trim() })
      console.log("Raw shipment from DB:", shipment ? "Found" : "Not found")
      if (shipment) {
        console.log("Raw shipment data:", {
          id: shipment._id,
          trackingNumber: shipment.trackingNumber,
          customerName: shipment.customerName,
          transitStops: shipment.transitStops?.length || 0,
          updates: shipment.updates?.length || 0
        })
      }
      
      if (!shipment) {
        console.log("No shipment found")
        return NextResponse.json({ error: "Shipment not found" }, { status: 404 })
      }

      // Convert mongoose document to plain object
      const shipmentObj = JSON.parse(JSON.stringify(shipment))
      console.log("Shipment after toJSON:", JSON.stringify(shipmentObj, null, 2))

      // Ensure all dates are properly formatted
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

      console.log("Final formatted shipment:", JSON.stringify(formattedShipment, null, 2))
      return NextResponse.json(formattedShipment)
    } else {
      const shipments = await Shipment.find().sort({ _id: -1 })
      
      // Format all shipments
      const formattedShipments = shipments.map(shipment => {
        const shipmentObj = JSON.parse(JSON.stringify(shipment))
        return {
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
      })
      
      return NextResponse.json(formattedShipments)
    }
  } catch (error) {
    console.error("GET /api/shipments error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  await dbConnect()

  const token = req.headers.get("Authorization")?.split(" ")[1]
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const decodedToken = verifyToken(token)
  if (!decodedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }
  
  if ('error' in decodedToken) {
    if (decodedToken.error === 'TOKEN_EXPIRED') {
      return NextResponse.json({ error: "Token expired", code: "TOKEN_EXPIRED" }, { status: 401 })
    }
    return NextResponse.json({ error: "Invalid token" }, { status: 401 })
  }

  if (!decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const shipmentData = await req.json()
    console.log("Received shipment data:", JSON.stringify(shipmentData, null, 2))

    // Set booking date if not provided
    if (!shipmentData.bookingDate) {
      shipmentData.bookingDate = new Date()
    }

    // Validate required fields
    const requiredFields = ['trackingNumber', 'customerName', 'customerMobile', 'status', 'origin', 'destination', 'estimatedDelivery']
    const missingFields = requiredFields.filter(field => !shipmentData[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate date format
    const estimatedDelivery = new Date(shipmentData.estimatedDelivery)
    if (isNaN(estimatedDelivery.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format for estimatedDelivery" },
        { status: 400 }
      )
    }

    // Set initial status and location if not provided
    if (!shipmentData.status) {
      shipmentData.status = "Pending"
    }
    
    // Set current location to origin if not provided
    if (!shipmentData.currentLocation) {
      shipmentData.currentLocation = shipmentData.origin
    }

    // Initialize empty arrays if not provided
    if (!Array.isArray(shipmentData.transitStops)) {
      shipmentData.transitStops = []
    }

    if (!Array.isArray(shipmentData.updates)) {
      shipmentData.updates = []
    }

    // Ensure transit stops have proper date objects
    shipmentData.transitStops = shipmentData.transitStops.map((stop: any) => ({
      ...stop,
      expectedArrival: new Date(stop.expectedArrival),
      expectedDeparture: new Date(stop.expectedDeparture)
    }))

    // Add initial booking update if not already present
    const hasBookingUpdate = shipmentData.updates.some(
      (update: any) => update.status === "Booking Confirmed"
    )

    if (!hasBookingUpdate) {
      shipmentData.updates.unshift({
        date: shipmentData.bookingDate,
        status: "Booking Confirmed",
        location: shipmentData.origin,
        notes: "Shipment booked successfully"
      })
    }

    console.log("Creating shipment with data:", JSON.stringify(shipmentData, null, 2))
    const shipment = await Shipment.create(shipmentData)
    console.log("Created shipment:", JSON.stringify(shipment, null, 2))

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

    console.log("Returning formatted shipment:", JSON.stringify(formattedShipment, null, 2))
    return NextResponse.json(formattedShipment, { status: 201 })
  } catch (error: any) {
    console.error("POST /api/shipments error:", error)
    
    // Handle duplicate tracking number
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Tracking number already exists" },
        { status: 400 }
      )
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create shipment" },
      { status: 500 }
    )
  }
}
