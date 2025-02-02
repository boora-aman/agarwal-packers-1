import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Consignment from '@/models/Consignment';
import { getServerSession } from 'next-auth';

// Create new consignment (Protected - Admin only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized abc' }, { status: 401 });
    }

    await dbConnect();
    const data = await req.json();
    
    const consignment = await Consignment.create(data);
    return NextResponse.json(consignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// Get consignment by tracking ID (Public)
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get('trackingId');

    if (!trackingId) {
      return NextResponse.json({ error: 'Tracking ID is required' }, { status: 400 });
    }

    await dbConnect();
    const consignment = await Consignment.findOne({ trackingId });

    if (!consignment) {
      return NextResponse.json({ error: 'Consignment not found' }, { status: 404 });
    }

    return NextResponse.json(consignment);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
