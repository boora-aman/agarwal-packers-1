import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Quotation } from "@/models/Quotation";
import { verifyToken } from "@/lib/auth";

function parseCharge(value: string | number | undefined): number {
  if (value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

interface QuotationDocument {
  quotationNo: string;
  _id: unknown;
  __v: number;
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
    console.log("Creating quotation:", data.quotationNo);

    // Convert charges to numbers with proper handling
    const charges = {
      freightCharges: parseCharge(data.charges?.freightCharges),
      carTransportationCharges: parseCharge(data.charges?.carTransportationCharges),
      packingCharges: parseCharge(data.charges?.packingCharges),
      unpackingCharges: parseCharge(data.charges?.unpackingCharges),
      loadingCharges: parseCharge(data.charges?.loadingCharges),
      unloadingCharges: parseCharge(data.charges?.unloadingCharges),
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
      installationCharges: data.installationCharges,
      stationeryCharges: data.stationeryCharges,
      tollCharges: data.tollCharges,
      gstCharges: data.gstCharges,
      insuranceCharges: data.insuranceCharges,
      ClientGst: data.ClientGst,
      companyName: data.companyName,
      insPercentage: data.insPercentage,
      gstPercentage: data.gstPercentage,
      charges,
      totalAmount: data.totalAmount || totalAmount // Use provided total or calculated
    };

    console.log("Processed data:", JSON.stringify(quotationData, null, 2));

    // Create new quotation
    const quotation = new Quotation(quotationData);

    // Save to database
    const savedQuotation = await quotation.save();
    console.log("Saved quotation:", savedQuotation._id);

    return NextResponse.json(savedQuotation, { status: 201 });
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
      console.log("No token provided");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || 'error' in decodedToken) {
      console.log("Invalid token:", decodedToken);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    await dbConnect();

    // Check if this is a request for the latest quotation number
    const url = new URL(req.url);
    if (url.searchParams.get('latest') === 'true') {
      const latestQuotation = await Quotation.findOne({})
        .sort({ quotationNo: -1 })
        .select('quotationNo')
        .lean() as QuotationDocument | null;
      
      let nextNumber;
      if (!latestQuotation) {
        nextNumber = 'QT8000';
      } else {
        // Extract number after 'Q' and increment
        const lastNumber = parseInt(latestQuotation.quotationNo.substring(2));
        const nextNum = isNaN(lastNumber) ? 1 : lastNumber + 1;
        nextNumber = `QT${nextNum.toString().padStart(4, '0')}`;
      }
      
      console.log('Last quotation:', latestQuotation?.quotationNo);
      console.log('Next number:', nextNumber);
      
      return NextResponse.json({ latestQuotationNo: nextNumber });
    }

    // Get all quotations, sorted by date descending
    const quotations = await Quotation.find({})
      .sort({ createdAt: -1 });
    
    console.log("Fetched quotations:", quotations.length);
    return NextResponse.json(quotations);
  } catch (error) {
    console.error("Error in GET /api/quotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotations" },
      { status: 500 }
    );
  }
} 