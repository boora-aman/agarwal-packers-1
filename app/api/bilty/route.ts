import { NextResponse } from "next/server"
import dbConnect from "@/lib/db"
import { Bilty } from "@/models/Bilty"
import { verifyToken } from "@/lib/auth"

function parseCharge(value: string): number {
  if (!value || value === '') return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
}

export async function POST(req: Request) {
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

    // Connect to database
    await dbConnect()

    // Get request data
    const data = await req.json()

    // Process charges
    const charges = {
      freightCharges: parseCharge(data.charges.freightCharges),
      carTransportationCharges: parseCharge(data.charges.carTransportationCharges),
      packunpackingCharges: parseCharge(data.charges.packunpackingCharges),
      loadingCharges: parseCharge(data.charges.loadingCharges),
      unloadingCharges: parseCharge(data.charges.unloadingCharges),
    }

    // Prepare bilty data matching your form structure
    const biltyData = {
      biltyNo: data.biltyNo,
      date: new Date(data.date),
      // Sender details
      senderName: data.senderName,
      senderaddress: data.senderaddress,
      fromGst: data.fromGst,
      fromContactNo: data.fromContactNo,
      // Receiver details
      receiverName: data.receiverName,
      receiveraddress: data.receiveraddress,
      toGst: data.toGst,
      toContactNo: data.toContactNo,
      email: data.email,
      // Location details
      fromCity: data.fromCity,
      toCity: data.toCity,
      distance: parseCharge(data.distance),
      // Package details
      description: data.description,
      weight: parseCharge(data.weight),
      NoPackage: parseCharge(data.NoPackage),
      packingType: data.packingType,
      // Vehicle details
      deliverytype: data.deliverytype,
      billno: data.billno,
      bikeno: data.bikeno,
      carno: data.carno,
      vehicleNo: data.vehicleNo,
      vehicleType: data.vehicleType,
      // Payment details
      paidAmount: parseCharge(data.paidAmount),
      topayAmount: parseCharge(data.topayAmount),
      trucktopayAmount: parseCharge(data.trucktopayAmount),
      // Insurance and GST
      gstserviceinsCharges: parseCharge(data.gstserviceinsCharges),
      insPercentage: parseCharge(data.insPercentage),
      insAmount: parseCharge(data.insAmount),
      insType: data.insType,
      stcharges: parseCharge(data.stcharges),
      gstPercentage: parseCharge(data.gstPercentage),
      // Charges
      charges,
      totalAmount: parseCharge(data.totalAmount),
      // Add metadata
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Create new bilty
    const bilty = new Bilty(biltyData)
    const savedBilty = await bilty.save()

    return NextResponse.json(savedBilty, { status: 201 })
  } catch (error: any) {
    console.error("Error creating bilty:", error)

    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Bilty number already exists" },
        { status: 400 }
      )
    }

    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      )
      return NextResponse.json(
        { error: "Validation failed", details: validationErrors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "Failed to create bilty" },
      { status: 500 }
    )
  }
}
interface BiltyDocument {
  biltyNo: string;
  _id: unknown;
  __v: number;
}
export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1]
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const decodedToken = verifyToken(token)
    if (!decodedToken || 'error' in decodedToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    await dbConnect()
    const url = new URL(req.url);
    if (url.searchParams.get('latest') === 'true') {
      const latestBilty = await Bilty.findOne({})
        .sort({ biltyNo: -1 })
        .select('biltyNo')
        .lean() as BiltyDocument | null;
      
      let nextNumber;
      if (!latestBilty) {
        nextNumber = 'B0001';
      } else {
        // Extract number after 'B' and increment
        const lastNumber = parseInt(latestBilty.biltyNo.substring(1));
        const nextNum = isNaN(lastNumber) ? 1 : lastNumber + 1;
        nextNumber = `B${nextNum.toString().padStart(4, '0')}`;
      }
      
      console.log('Last bilty:', latestBilty?.biltyNo);
      console.log('Next number:', nextNumber);
      
      return NextResponse.json({ latestBiltyNo: nextNumber });
    }
    const bilties = await Bilty.find({}).sort({ createdAt: -1 })
    
    return NextResponse.json(bilties)
  } catch (error) {
    console.error("Error fetching bilties:", error)
    return NextResponse.json(
      { error: "Failed to fetch bilties" },
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

    await dbConnect()
    await Bilty.findByIdAndDelete(params.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting bilty:", error)
    return NextResponse.json(
      { error: "Failed to delete bilty" },
      { status: 500 }
    )
  }
}


