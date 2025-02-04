import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import {Quotation} from '@/models/Quotation';
import { verifyToken } from '@/lib/auth';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  try {
    const { id } = params;
    const data = await req.json();
    const updatedQuotation = await Quotation.findByIdAndUpdate(id, data, { new: true });

    if (!updatedQuotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, updatedQuotation });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await connectDB();

  const token = req.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decodedToken = verifyToken(token);
  if (!decodedToken || !decodedToken.adminId) {
    return NextResponse.json({ error: "Unauthorized Access" }, { status: 401 });
  }

  try {
    const { id } = params;
    const deletedQuotation = await Quotation.findByIdAndDelete(id);

    if (!deletedQuotation) {
      return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}