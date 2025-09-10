import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { Receipt } from "@/models/receipt";
import { verifyToken } from "@/lib/auth";

function parseCharge(value: string | number | undefined): number {
  if (value === undefined || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

interface ReceiptDocument {
  mrNo: string;
  _id: string;
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
    console.log("Connected to DB for POST receipt");

    // Get request data
    const data = await req.json();
    console.log("Creating receipt:", data.mrNo);

    // Convert charges to numbers with proper handling
    const charges = {
      freight: parseCharge(data.charges?.freight),
      carTransport: parseCharge(data.charges?.carTransport),
      PackUnpack: parseCharge(data.charges?.PackUnpack),
      LoadUnload: parseCharge(data.charges?.LoadUnload),
      StCharges: parseCharge(data.charges?.StCharges),
      GstCharges: parseCharge(data.charges?.GstCharges),
      insCharges: parseCharge(data.charges?.insCharges)
    };

    // Calculate total
    const totalAmount = Object.values(charges).reduce((sum, val) => sum + val, 0);

    // Prepare receipt data
    const receiptData = {
      mrNo: data.mrNo,
      date: new Date(data.date),
      customerName: data.customerName,
      fromCity: data.fromCity,
      biltyNo: data.biltyNo,
      billNo: data.billNo,
      NoPackage: data.NoPackage,
      datebook: data.datebook,
      cash: data.cash,
      cheque: data.cheque,
      account: data.account,
      rupeestext: data.rupeestext,
      charges,
      totalamount: data.totalamount || totalAmount
    };

    console.log("Processed receipt data:", JSON.stringify(receiptData, null, 2));

    // Create new receipt
    const receipt = new Receipt(receiptData);

    // Save to database
    const savedReceipt = await receipt.save();
    console.log("Saved receipt:", savedReceipt._id);

    return NextResponse.json(savedReceipt, { status: 201 });
  } catch (error: any) {
    console.error("Error creating receipt:", error);
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Receipt number already exists" },
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
      { error: "Failed to create receipt", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    // Verify authentication
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      console.log("No token provided for receipts");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken || 'error' in decodedToken) {
      console.log("Invalid token for receipts:", decodedToken);
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    // Connect to database
    console.log("Connecting to DB for receipts GET...");
    await dbConnect();
    console.log("Connected to DB for receipts GET");

    const url = new URL(req.url);

    // Handle latest receipt request
    if (url.searchParams.get('latest') === 'true') {
      console.log("Fetching latest receipt number...");
      const latestReceipt = await Receipt.findOne({})
        .sort({ mrNo: -1 })
        .select('mrNo')
        .lean() as ReceiptDocument | null;

      let nextNumber;
      if (!latestReceipt) {
        nextNumber = 'MR8000';
      } else {
        const lastNumber = parseInt(latestReceipt.mrNo.substring(2));
        const nextNum = isNaN(lastNumber) ? 8000 : lastNumber + 1;
        nextNumber = `MR${nextNum.toString().padStart(4, '0')}`;
      }

      console.log('Last receipt:', latestReceipt?.mrNo);
      console.log('Next receipt number:', nextNumber);
      return NextResponse.json({ latestmrNo: nextNumber });
    }

    // Handle paginated receipts request
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;

    console.log(`Fetching receipts - page: ${page}, limit: ${limit}, skip: ${skip}`);

    // Get total count for pagination info
    const totalCount = await Receipt.countDocuments({});
    console.log(`Total receipts count: ${totalCount}`);

    // Fetch paginated receipts
    const receipts = await Receipt.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const hasMore = skip + receipts.length < totalCount;

    console.log(`Fetched ${receipts.length} receipts (page ${page}, limit ${limit}), hasMore: ${hasMore}`);

    const response = {
      receipts,
      pagination: {
        page,
        limit,
        totalCount,
        hasMore,
        totalPages: Math.ceil(totalCount / limit)
      }
    };

    console.log('Sending receipts response:', JSON.stringify(response, null, 2));
    return NextResponse.json(response);

  } catch (error: any) {
    console.error("Error in GET /api/receipts:", error);
    return NextResponse.json(
      { error: "Failed to fetch receipts", details: error.message },
      { status: 500 }
    );
  }
}
