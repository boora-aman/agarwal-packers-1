import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Quotation } from "@/models/Quotation";
import { verifyToken } from "@/lib/auth";

function parseCharge(value: string | number | undefined): number {
  if (value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export async function POST(req: Request) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get request data
    const data = await req.json();
    console.log("Received data:", JSON.stringify(data, null, 2));

    // Convert charges to numbers with proper handling
    const charges = {
      freightCharges: parseCharge(data.charges?.freightCharges),
      carTransportationCharges: parseCharge(data.charges?.carTransportationCharges),
      packingCharges: parseCharge(data.charges?.packingCharges),
      unpackingCharges: parseCharge(data.charges?.unpackingCharges),
      loadingCharges: parseCharge(data.charges?.loadingCharges),
      unloadingCharges: parseCharge(data.charges?.unloadingCharges),
      installationCharges: parseCharge(data.charges?.installationCharges),
      stationeryCharges: parseCharge(data.charges?.stationeryCharges),
      tollCharges: parseCharge(data.charges?.tollCharges),
      gstCharges: parseCharge(data.charges?.gstCharges),
      insuranceCharges: parseCharge(data.charges?.insuranceCharges)
    };

    // Calculate total
    const totalAmount = Object.values(charges).reduce((sum, val) => sum + val, 0);

    // Prepare quotation data
    const quotationData = {
      quotationNo: data.quotationNo,
      date: new Date(data.date),
      vehicleType: data.vehicleType,
      customerName: data.customerName,
      address: data.address,
      email: data.email || "",
      mobileNo: data.mobileNo,
      fromCity: data.fromCity,
      toCity: data.toCity,
      charges,
      totalAmount: data.totalAmount || totalAmount // Use provided total or calculated
    };

    console.log("Processed data:", JSON.stringify(quotationData, null, 2));

    // Create new quotation
    const quotation = new Quotation(quotationData);

    // Save to database
    const savedQuotation = await quotation.save();
    console.log("Saved quotation:", JSON.stringify(savedQuotation, null, 2));

    return NextResponse.json(
      { success: true, quotation: savedQuotation },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating quotation:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Quotation number already exists" },
        { status: 400 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create quotation", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Get all quotations, sorted by date descending
    const quotations = await Quotation.find({})
      .sort({ createdAt: -1 });

    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error fetching quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
} 