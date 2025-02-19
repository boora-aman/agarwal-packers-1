import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Bills } from "@/models/Bills";
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
    console.log("Connected to DB:", process.env.MONGODB_URI); // Will be redacted in logs

    // Get request data
    const data = await req.json();
    console.log("Creating bill:", data.billNo);

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

    // Prepare bill data
    const billData = {
      billNo: data.billNo,
      date: new Date(data.date),
      customerName: data.customerName,
      address: data.address,
      email: data.email || "",
      mobileNo: data.mobileNo,
      fromCity: data.fromCity,
      toCity: data.toCity,
      weight: data.weight,
      distance: data.distance,
      ClientGst: data.ClientGst,
      StateCode: data.StateCode,
      biltyNo: data.biltyNo,
      NoPackage: data.NoPackage,
      insPercentage: data.insPercentage,
      insValue: data.insValue,
      GstPercentage: data.GstPercentage,
      charges,
      totalAmount: data.totalAmount || totalAmount // Use provided total or calculated
    };

    console.log("Processed data:", JSON.stringify(billData, null, 2));

    // Create new bill
    const bill = new Bills(billData);

    // Save to database
    const savedBill = await bill.save();
    console.log("Saved bill:", savedBill._id);

    return NextResponse.json(savedBill, { status: 201 });
  } catch (error: any) {
    console.error("Error creating bill:", error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bill number already exists" },
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
      { error: "Failed to create bill", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || 'error' in decodedToken) {
      console.log("Invalid token:", decodedToken);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    console.log("Connecting to DB...");
    await dbConnect();
    console.log("Connected to DB");

    // Get all bills, sorted by date descending
    const bills = await Bills.find({})
      .sort({ createdAt: -1 });
    
    console.log("Fetched bills:", bills.length);
    return NextResponse.json(bills);
  } catch (error) {
    console.error("Error in GET /api/bills:", error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 }
    );
  }
} 